import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ForgotPasswordEmailProps {
  username: string;
  userEmail: string;
  resetUrl: string;
}

const ForgotPasswordEmail = (props: ForgotPasswordEmailProps) => {
  const { username, userEmail, resetUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl shadow-lg max-w-150 mx-auto p-10">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="text-28px font-bold text-gray-900 m-0 mb-2">
                Password Reset Request
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-4">
                Hello, {username}
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-4">
                We received a request to reset the password for your account
                associated with <strong>{userEmail}</strong>. If you made this
                request, click the button below to reset your password.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-6">
                This link will expire in 24 hours for security reasons.
              </Text>

              {/* Reset Button */}
              <Section className="text-center mb-8">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 text-white font-semibold py-[12px] px-[32px] rounded-[6px] text-[16px] no-underline box-border hover:bg-blue-700"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 leading-[20px] mb-4">
                If the button doesn&apos;t work, you can copy and paste this
                link into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all mb-6">
                <Link href={resetUrl} className="text-blue-600 underline">
                  {resetUrl}
                </Link>
              </Text>

              <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                If you didn&apos;t request a password reset, you can safely
                ignore this email. Your password will remain unchanged.
              </Text>

              <Text className="text-[16px] text-gray-700 leading-6">
                For security reasons, please don&apos;t share this email with
                anyone.
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="bg-gray-50 rounded-[6px] p-[20px] mb-8">
              <Text className="text-[14px] text-gray-600 leading-5 m-0">
                <strong>Security tip:</strong> Always verify that password reset
                emails come from a trusted source. If you&apos;re unsure about
                this email&apos;s authenticity, contact our support team
                directly.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-6">
              <Text className="text-[12px] text-gray-500 leading-4 mb-2 m-0">
                This email was sent to {userEmail}
              </Text>
              <Text className="text-[12px] text-gray-500 leading-4 mb-2 m-0">
                © 2026 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 leading-4 m-0">
                123 Business Street, Suite 100, Strasbourg, France 67000
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;
