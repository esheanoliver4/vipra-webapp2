import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendApprovalEmail(
  userEmail: string,
  userName: string,
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
) {
  let subject = '';
  let htmlContent = '';

  if (status === 'approved') {
    subject = 'Your VipraPariwar Profile Has Been Approved!';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #c41e3a;">Welcome to VipraPariwar!</h1>
        <p>Hi ${userName},</p>
        <p>Great news! Your profile has been approved by our team. You can now explore other profiles, make connections, and find your perfect match.</p>
        <p><strong>What's next?</strong></p>
        <ul>
          <li>Complete your profile with photos and details</li>
          <li>Browse other profiles in our community</li>
          <li>Send connection requests</li>
          <li>Use Kundli Milan to check compatibility</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/browse" style="background-color: #c41e3a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Exploring</a></p>
        <p>Best regards,<br>VipraPariwar Team</p>
      </div>
    `;
  } else if (status === 'rejected') {
    subject = 'VipraPariwar Profile Review';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #c41e3a;">Profile Review Update</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for submitting your profile to VipraPariwar. After review, we have some feedback:</p>
        <p><strong>Reason for rejection:</strong></p>
        <p>${notes || 'Your profile did not meet our community guidelines.'}</p>
        <p>Please update your profile and resubmit for review. We're here to help you find your match!</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/edit-profile" style="background-color: #c41e3a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Update Profile</a></p>
        <p>Best regards,<br>VipraPariwar Team</p>
      </div>
    `;
  } else {
    subject = 'Your VipraPariwar Profile is Under Review';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #c41e3a;">Profile Under Review</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for registering with VipraPariwar! Your profile is currently under review by our team.</p>
        <p>We typically approve profiles within 24-48 hours. You'll receive an email once your profile is approved.</p>
        <p>In the meantime, you can:</p>
        <ul>
          <li>Complete your profile with detailed information</li>
          <li>Upload high-quality profile photos</li>
          <li>Add your preferences and interests</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/edit-profile" style="background-color: #c41e3a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Complete Your Profile</a></p>
        <p>Best regards,<br>VipraPariwar Team</p>
      </div>
    `;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"VipraPariwar" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html: htmlContent,
    });
    console.log('[v0] Email sent successfully to:', userEmail);
    return true;
  } catch (error) {
    console.error('[v0] Email sending error:', error);
    return false;
  }
}

export async function sendAdminNotificationEmail(
  adminEmail: string,
  userName: string,
  userEmail: string
) {
  const subject = `New Profile Pending Approval: ${userName}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Profile Pending Approval</h2>
      <p>User: ${userName}</p>
      <p>Email: ${userEmail}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="background-color: #c41e3a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Review Profile</a></p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"VipraPariwar" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('[v0] Admin notification error:', error);
    return false;
  }
}
export async function sendConnectionNotification(
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  type: 'new_request' | 'request_accepted'
) {
  let subject = '';
  let htmlContent = '';

  if (type === 'new_request') {
    subject = `New Connection Request from ${senderName}`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c41e3a;">You have a new connection request!</h2>
        <p>Hi ${recipientName},</p>
        <p><strong>${senderName}</strong> is interested in your profile and has sent you a connection request on VipraPariwar.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/connections" style="background-color: #c41e3a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Request</a></p>
        <p>Best regards,<br>VipraPariwar Team</p>
      </div>
    `;
  } else {
    subject = `${senderName} accepted your connection request!`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c41e3a;">Connection Accepted!</h2>
        <p>Hi ${recipientName},</p>
        <p>Great news! <strong>${senderName}</strong> has accepted your connection request. You can now start messaging each other.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/messages" style="background-color: #c41e3a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Chatting</a></p>
        <p>Best regards,<br>VipraPariwar Team</p>
      </div>
    `;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"VipraPariwar" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('[v0] Connection notification error:', error);
    return false;
  }
}
