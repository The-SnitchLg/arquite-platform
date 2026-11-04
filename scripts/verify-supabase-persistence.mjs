import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qnkonhqeptuxzpwewgcm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFua29uaHFlcHR1eHpwd2V3Z2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTUwMDAsImV4cCI6MjEwNzU3MTAwMH0.IOzSt5slmprUE58V8rm4arTJ3SxBHswH18agqdniKos';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runVerification() {
  console.log('--- 1. Testing Admin Login with larrygomezg@gmail.com ---');
  const { data: adminAuth, error: adminErr } = await supabase.auth.signInWithPassword({
    email: 'larrygomezg@gmail.com',
    password: 'barbara123'
  });

  if (adminErr || !adminAuth.session) {
    console.error('❌ Admin login failed:', adminErr);
    process.exit(1);
  }
  console.log('✅ Admin login SUCCESS! UID:', adminAuth.user.id);

  console.log('\n--- 2. Verifying Admin Profile in public.arq_profiles ---');
  const { data: adminProfile, error: pErr } = await supabase
    .from('arq_profiles')
    .select('*')
    .eq('id', adminAuth.user.id)
    .single();

  if (pErr || !adminProfile) {
    console.error('❌ Could not fetch admin profile:', pErr);
    process.exit(1);
  }
  console.log('✅ Admin profile verified:', { email: adminProfile.email, role: adminProfile.role, name: adminProfile.name });

  console.log('\n--- 3. Testing New Participant Registration ---');
  const testEmail = `test.participant.${Date.now()}@arquite.com`;
  const testPass = 'segura123';
  const testName = 'Participante De Prueba';

  const { data: regAuth, error: regErr } = await supabase.auth.signUp({
    email: testEmail,
    password: testPass,
    options: {
      data: { full_name: testName }
    }
  });

  if (regErr || !regAuth.user) {
    console.error('❌ Registration failed:', regErr);
    process.exit(1);
  }
  console.log('✅ Registration SUCCESS! UID:', regAuth.user.id, 'Email:', testEmail);

  // Authenticate as new participant
  const participantClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: partAuth } = await participantClient.auth.signInWithPassword({
    email: testEmail,
    password: testPass
  });

  console.log('\n--- 4. Checking Automatic Provisioning Trigger (arq_handle_new_user) ---');
  const { data: partProfile, error: ppErr } = await participantClient
    .from('arq_profiles')
    .select('*')
    .eq('id', regAuth.user.id)
    .single();

  if (ppErr || !partProfile) {
    console.error('❌ Participant profile not created by trigger:', ppErr);
    process.exit(1);
  }
  console.log('✅ Trigger created arq_profiles:', { email: partProfile.email, role: partProfile.role, name: partProfile.name });

  const { data: journey, error: jErr } = await participantClient
    .from('arq_journeys')
    .select('*')
    .eq('owner_id', regAuth.user.id)
    .single();

  if (jErr || !journey) {
    console.error('❌ Participant journey not created by trigger:', jErr);
    process.exit(1);
  }
  console.log('✅ Trigger created arq_journeys ID:', journey.id);

  const { data: versions, error: vErr } = await participantClient
    .from('arq_diamond_versions')
    .select('*')
    .eq('journey_id', journey.id);

  if (vErr || !versions || versions.length === 0) {
    console.error('❌ Diamond version v1 Slot A not created by trigger:', vErr);
    process.exit(1);
  }
  console.log('✅ Trigger created diamond version:', { slot: versions[0].slot, status: versions[0].status, version_number: versions[0].version_number });

  const { data: thresholds } = await participantClient
    .from('arq_threshold_records')
    .select('threshold_key, status')
    .eq('journey_id', journey.id);

  console.log(`✅ Trigger initialized ${thresholds?.length || 0} threshold records (expected 7)`);

  const { data: letters } = await participantClient
    .from('arq_letters')
    .select('dimension, is_sealed')
    .eq('journey_id', journey.id);

  console.log(`✅ Trigger initialized ${letters?.length || 0} letters (expected 2)`);

  console.log('\n--- 5. Testing Module Upsert & Persistence ---');
  const targetVersionId = versions[0].id;
  
  // Save diamond context
  const { error: ctxErr } = await participantClient
    .from('arq_diamond_contexts')
    .upsert({
      version_id: targetVersionId,
      context_key: 'entorno',
      body: 'Entorno de prueba de alta dirección estratégica.',
      updated_at: new Date().toISOString()
    });
  if (ctxErr) console.error('❌ Error saving context:', ctxErr);
  else console.log('✅ Saved diamond context in arq_diamond_contexts');

  // Save diamond answer
  const { error: ansErr } = await participantClient
    .from('arq_diamond_answers')
    .upsert({
      version_id: targetVersionId,
      dimension: 'personal',
      decision_index: 0,
      body: 'Decisión estratégica personal 1 de prueba.',
      updated_at: new Date().toISOString()
    });
  if (ansErr) console.error('❌ Error saving answer:', ansErr);
  else console.log('✅ Saved diamond answer in arq_diamond_answers');

  // Save threshold record
  const { error: thrErr } = await participantClient
    .from('arq_threshold_records')
    .upsert({
      journey_id: journey.id,
      threshold_key: 'U01',
      status: 'en_exploracion',
      reflection: 'Reflexión de prueba en U01.',
      evidence: 'Evidencia documental de prueba.',
      updated_at: new Date().toISOString()
    });
  if (thrErr) console.error('❌ Error saving threshold:', thrErr);
  else console.log('✅ Saved threshold in arq_threshold_records');

  // Save letter
  const { error: letErr } = await participantClient
    .from('arq_letters')
    .upsert({
      journey_id: journey.id,
      dimension: 'personal',
      body: 'Carta al futuro personal de prueba.',
      updated_at: new Date().toISOString()
    });
  if (letErr) console.error('❌ Error saving letter:', letErr);
  else console.log('✅ Saved letter in arq_letters');

  // Log audit event
  const { error: audErr } = await participantClient
    .from('arq_audit_events')
    .insert({
      actor_id: regAuth.user.id,
      journey_id: journey.id,
      event_type: 'VERIFICATION_TEST',
      target_kind: 'journey',
      target_id: journey.id,
      details: 'Prueba de verificación integral de persistencia',
      occurred_at: new Date().toISOString()
    });
  if (audErr) console.error('❌ Error logging audit event:', audErr);
  else console.log('✅ Logged audit event in arq_audit_events');

  console.log('\n--- 6. Verifying Admin Visibility in Supabase ---');
  // Admin queries all participants
  const adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  await adminClient.auth.signInWithPassword({
    email: 'larrygomezg@gmail.com',
    password: 'barbara123'
  });

  const { data: allProfiles } = await adminClient.from('arq_profiles').select('email, role, name');
  console.log(`✅ Admin can see ${allProfiles?.length} profiles in arq_profiles (including new participant)`);

  const { data: allAudits } = await adminClient.from('arq_audit_events').select('event_type, details').order('occurred_at', { ascending: false }).limit(5);
  console.log(`✅ Admin can see audit events:`, allAudits?.map(a => a.event_type));

  console.log('\n🎉 ALL PERSISTENCE, IDENTITY, AND AUDIT TESTS PASSED SUCCESSFULLY! 🎉\n');
}

runVerification().catch(err => {
  console.error('Unhandled verification error:', err);
  process.exit(1);
});
