import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      gender,
      dob,
      profileFor,
      gotra,
      currentPracticedGotra,
      religion,
      caste,
      city,
      timeOfBirth,
      placeOfBirth,
      fatherName,
      motherName,
      parentsContactNumber,
      education,
      profession,
      companyWorkingAt,
      motherTongue,
      maritalStatus,
      hobbies,
      siblings,
    } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields: name, email, password' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create user with Supabase Auth (Confirmed automatically)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json(
        { message: authError.message },
        { status: 400 }
      );
    }

    const userId = authData.user.id;
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ').slice(1).join(' ') || '';

    // Create main user record
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          auth_id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          gender: gender === 'male' ? 'male' : 'female',
          gender_locked: false,
          date_of_birth: dob, // Matches SQL 'date_of_birth'
          role: 'user',
          is_verified: false,
          is_premium: false,
          premium_plan: 'free',
          approval_status: 'pending',
          is_approved: false,
          marital_status: maritalStatus || 'never_married',
          location_city: city || '',
          mother_tongue: motherTongue || '',
          hobbies: hobbies || '',
          profession: profession || '',
          education: education || '',
          company_working_at: companyWorkingAt || '',
          father_name: fatherName || '',
          mother_name: motherName || '',
          siblings: siblings || 0,
          parents_contact_number: parentsContactNumber || '',
        },
      ])
      .select()
      .single();

    if (userError) {
      console.error('[v0] User creation error:', userError);
      return NextResponse.json(
        { message: 'Failed to create user: ' + userError.message },
        { status: 400 }
      );
    }

    // Create kundli record (Separate table in SQL)
    if (dob || timeOfBirth || placeOfBirth) {
      const { error: kundliError } = await supabase
        .from('kundlis')
        .insert([
          {
            user_id: userData.id,
            birth_date: dob,
            birth_time: timeOfBirth || null,
            birth_place: placeOfBirth || '',
            gotra: gotra || '',
          },
        ]);

      if (kundliError) {
        console.warn('[v0] Kundli creation warning:', kundliError);
      }
    }

    // Create approval log
    const { error: logError } = await supabase
      .from('approval_logs')
      .insert([
        {
          user_id: userData.id,
          status: 'submitted',
          notes: 'User submitted for approval after registration',
        },
      ]);

    if (logError) {
      console.warn('[v0] Approval log creation warning:', logError);
    }

    return NextResponse.json(
      {
        message: 'Registration successful! Your profile is pending admin approval.',
        user: userData,
        auth: authData.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
