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

interface VerificationEmailProps {
  userName: string;
  verificationUrl: string;
}

const VerificationEmail = ({
  userName,
  verificationUrl,
}: VerificationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        Please verify your email address to complete your account setup
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            <Section>
              <Heading className="text-[32px] font-bold text-gray-900 text-center mb-[32px] mt-0">
                Verify Your Email Address
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                Hi there {userName}!
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                Thanks for signing up! We&apos;re excited to have you on board.
                To complete your account setup and ensure the security of your
                account, please verify your email address by clicking the button
                below.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-[20px]">
                If the button above doesn&apos;t work, you can also copy and
                paste the following link into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-[32px] break-all">
                <Link
                  href={verificationUrl}
                  className="text-blue-600 underline"
                >
                  {verificationUrl}
                </Link>
              </Text>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-[20px]">
                This verification link will expire in 24 hours for security
                reasons. If you didn&apos;t create an account with us, you can
                safely ignore this email.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[32px] leading-[24px]">
                Best regards,
                <br />
                The Team
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-gray-200 pt-[32px] mt-[40px]">
              <Text className="text-[12px] text-gray-500 text-center mb-[8px] m-0">
                © 2026 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 text-center mb-[8px] m-0">
                123 Business Street, Suite 100, City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                <Link href="#" className="text-gray-500 underline">
                  Unsubscribe
                </Link>
                {" | "}
                <Link href="#" className="text-gray-500 underline">
                  Privacy Policy
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
