import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhdcjaphoncuifhvdyat.supabase.co';
const supabaseAnonKey = 'sb_publishable_XgYI0zcUPNh6HZK7nZeKcA_yUxsMw5b';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDatabase() {
  console.log('🚀 Seeding permanent Supabase database records...');

  const usersToSeed = [
    { id: '10000000-0000-4000-8000-000000000000', name: 'System Admin', email: '01700000000', role: 'admin' },
    { id: '20000000-0000-4000-8000-000000000001', name: 'Sales Representative 1', email: '01800000001', role: 'employee' },
    { id: '20000000-0000-4000-8000-000000000002', name: 'Sales Representative 2', email: '01800000002', role: 'employee' },
    { id: '30000000-0000-4000-8000-000000000001', name: 'আরিফ হোসেন (Guardian 1)', email: '01900000001', role: 'guardian' },
    { id: '30000000-0000-4000-8000-000000000002', name: 'মাহমুদুল হাসান (Guardian 2)', email: '01900000002', role: 'guardian' },
    { id: '40000000-0000-4000-8000-000000000001', name: 'রাহেলা খাতুন (Teacher 1)', email: '01600000001', role: 'teacher' },
    { id: '40000000-0000-4000-8000-000000000002', name: 'ফারহানা ইয়াসমিন (Teacher 2)', email: '01600000002', role: 'teacher' },
  ];

  for (const u of usersToSeed) {
    let { error } = await supabase.from('users').upsert(u, { onConflict: 'id' });
    if (error) {
      // Try role = 'sales'
      const uAlt = { ...u, role: 'sales' };
      const { error: err2 } = await supabase.from('users').upsert(uAlt, { onConflict: 'id' });
      if (err2) {
        console.warn(`Notice upserting user ${u.email}:`, err2.message);
      } else {
        console.log(`✅ Upserted user: ${u.name} (${u.email}) -> sales`);
      }
    } else {
      console.log(`✅ Upserted user: ${u.name} (${u.email}) -> ${u.role}`);
    }
  }

  // Also seed staff table for Telesales & Teachers
  const staffToSeed = [
    { id: 'staff-101', name: 'Sales Representative 1', email: '01800000001', phone: '01800000001', role: 'Telesales', status: 'Active', temp_password: 'sales123' },
    { id: 'staff-102', name: 'Sales Representative 2', email: '01800000002', phone: '01800000002', role: 'Telesales', status: 'Active', temp_password: 'sales123' },
    { id: 'staff-103', name: 'রাহেলা খাতুন (Teacher 1)', email: '01600000001', phone: '01600000001', role: 'Teacher', status: 'Active', temp_password: 'teach123' },
    { id: 'staff-104', name: 'ফারহানা ইয়াসমিন (Teacher 2)', email: '01600000002', phone: '01600000002', role: 'Teacher', status: 'Active', temp_password: 'teach123' },
  ];

  for (const st of staffToSeed) {
    try {
      await supabase.from('staff').upsert(st);
    } catch (e) {}
  }
  console.log('✅ Seeded staff table records');

  // 2. Clear records for Guardian 1 (01900000001) so dashboard is blank ("Awaiting first class")
  const g1Phone = '01900000001';
  try {
    await supabase.from('attendance').delete().eq('phone', g1Phone);
    await supabase.from('attendance_logs').delete().eq('phone', g1Phone);
    await supabase.from('marks').delete().eq('phone', g1Phone);
    await supabase.from('homework_submissions').delete().eq('phone', g1Phone);
    console.log('✅ Cleared academic records for Guardian 1 (01900000001) for blank initial state');
  } catch (e) {
    console.warn('Notice clearing Guardian 1 records:', e.message);
  }

  // 3. Seed permanent academic records for Guardian 2 (01900000002)
  const g2Phone = '01900000002';
  const g2Id = 'grd-01900000002';

  const attendanceRecords = [
    { student_id: g2Id, phone: g2Phone, date: '2026-08-10', status: 'Present', student_name: 'তাহমিদ হাসান' },
    { student_id: g2Id, phone: g2Phone, date: '2026-08-12', status: 'Present', student_name: 'তাহমিদ হাসান' },
    { student_id: g2Id, phone: g2Phone, date: '2026-08-14', status: 'Present', student_name: 'তাহমিদ হাসান' },
    { student_id: g2Id, phone: g2Phone, date: '2026-08-16', status: 'Late', student_name: 'তাহমিদ হাসান' },
  ];

  for (const att of attendanceRecords) {
    try {
      await supabase.from('attendance').upsert(att);
      await supabase.from('attendance_logs').upsert(att);
    } catch (e) {}
  }
  console.log('✅ Seeded historical attendance records for Guardian 2');

  const homeworkSubmissions = [
    {
      id: 'hw-sub-101',
      student_id: g2Id,
      phone: g2Phone,
      student_name: 'তাহমিদ হাসান',
      title: 'হাতের লেখা অনুশীলন পৃষ্ঠা ৫-৭',
      subject: 'বাংলা সুন্দর হাতের লেখা',
      submitted_date: '2026-08-15',
      score: 95,
      grade: 'A+',
      feedback: 'হাতের লেখা চমৎকার পরিচ্ছন্ন ও অক্ষরের গঠন নির্ভুল হয়েছে।',
      status: 'Graded',
    },
    {
      id: 'hw-sub-102',
      student_id: g2Id,
      phone: g2Phone,
      student_name: 'তাহমিদ হাসান',
      title: 'শব্দ তৈরি ও বানান অনুশীলন',
      subject: 'বাংলা সুন্দর হাতের লেখা',
      submitted_date: '2026-08-17',
      score: 90,
      grade: 'A',
      feedback: 'খুব ভালো পারফরম্যান্স! মাত্রা ও আকারের সামঞ্জস্য বজায় ছিল।',
      status: 'Graded',
    },
  ];

  for (const hw of homeworkSubmissions) {
    try {
      await supabase.from('homework_submissions').upsert(hw);
      await supabase.from('marks').upsert({
        student_id: g2Id,
        phone: g2Phone,
        exam_name: hw.title,
        score: hw.score,
        grade: hw.grade,
      });
    } catch (e) {}
  }
  console.log('✅ Seeded historical homework & marks records for Guardian 2');

  console.log('🎉 Supabase Database Seeding Complete!');
}

seedDatabase().catch((err) => console.error('Error in seed script:', err));
