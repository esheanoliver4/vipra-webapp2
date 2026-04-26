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

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
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
          gender_locked: false, // Will be locked after first gender selection
          date_of_birth: dob,
          role: 'user',
          is_verified: false,
          is_premium: false,
          premium_plan: 'free',
          approval_status: 'pending', // Waiting for admin approval
          is_approved: false,
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

    // Create profile record
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: userData.id,
          marital_status: maritalStatus || 'never_married',
          religion: religion || 'brahmin',
          gotra: gotra || '',
          caste: caste || '',
          location_city: city || '',
          mother_tongue: motherTongue || '',
          hobbies: hobbies || '',
          occupation: profession || '',
          education: education || '',
          family_type: 'nuclear',
          looking_for: profileFor || 'marriage',
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error('[v0] Profile creation error:', profileError);
      // Continue even if profile creation has minor issues
    }

    // Create kundli record if data provided
    if (dob && placeOfBirth) {
      const { error: kundliError } = await supabase
        .from('kundlis')
        .insert([
          {
            user_id: userData.id,
            date_of_birth: dob,
            time_of_birth: timeOfBirth || null,
            place_of_birth: placeOfBirth || '',
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
