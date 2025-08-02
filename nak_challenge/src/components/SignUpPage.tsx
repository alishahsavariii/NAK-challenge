import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"; // For i18n
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { zodResolver } from "@hookform/resolvers/zod";

// We need the schema for the resolver, but it's already in the store file.
// In a real app, you might put the Zod schema in a shared types file.
import { z } from "zod";
import { RegisterFormData, useAuthStore } from "../stores/authStore";
const registerSchema = z.object({
  name: z.string().min(1, { message: "errors.nameRequired" }),
  email: z.string().email({ message: "errors.invalidEmail" }),
  password: z.string().min(8, { message: "errors.passwordTooShort" }),
  lastName: z.string().min(1, { message: "errors.lastName" }),
});

// EmotionJS Styled Components
const PageContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f7f8fa;
`;

const FormContainer = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  height: 726px;
  background-color: #fafafaff;

  @media (min-width: 1024px) {
    flex-basis: 50%;
  }
`;

const FormWrapper = styled.div`
  width: 550px;
  height : 526px;
  background-color: #ffffff;
  border-radius : 40px
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #00000;
  margin-bottom: 0.5rem;
  padding : 0.5rem 5rem
 
`;

const Subtitle = styled.p`
  color: #6c757d;
  margin-bottom: 2.5rem;
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  margin : 10px 80px;
  border-radius: 40px;
  

`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
  width : 80%
`;

const Input = styled.input`
  width: 70%;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;


  &:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  background-color: #0d6efd;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0b5ed7;
  }

  &:disabled {
    background-color: #a0c7ff;
    cursor: not-allowed;
  }
`;

const SignInLink = styled.p`
  text-align: center;
  color: #6c757d;
  margin-top: 1.5rem;

  a {
    color: #0d6efd;
    font-weight: 600;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ImageContainer = styled.aside`
  display: none; // Hidden on mobile

  @media (min-width: 1024px) {
    display: block;
    flex-basis: 50%;
    background-image: url("/path/to/your/image.jpg"); // **REPLACE THIS PATH**
    background-size: cover;
    background-position: center;
  }
`;

// The main component
export function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error: apiError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser(data);
    if (success) {
      navigate("/login");
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <FormWrapper>
          <Title>{t("signUp.title")}</Title>
          <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
            <InputWrapper>
              <Input
                id="name"
                placeholder={t("signUp.form.nameLabel")}
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <ErrorMessage>{t(errors.name.message as string)}</ErrorMessage>
              )}
            </InputWrapper>
            <InputWrapper>
              <Input
                id="lastname"
                placeholder={t("signUp.form.lastName")}
                type="text"
                {...register("lastName")}
              />
              {errors.name && (
                <ErrorMessage>{t(errors.name.message as string)}</ErrorMessage>
              )}
            </InputWrapper>

            {/* <InputWrapper>
              <Input
                id="userName"
                placeholder={t("signUp.form.nameLabel")}
                type="text"
                {...register("userName")}
              />
              {errors.name && (
                <ErrorMessage>{t(errors.name.message as string)}</ErrorMessage>
              )}
            </InputWrapper> */}

            <InputWrapper>
              <Input
                id="email"
                placeholder={t("signUp.form.emailLabel")}
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <ErrorMessage>{t(errors.email.message as string)}</ErrorMessage>
              )}
            </InputWrapper>

            <InputWrapper>
              <Input
                id="password"
                placeholder={t("signUp.form.passwordLabel")}
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <ErrorMessage>
                  {t(errors.password.message as string)}
                </ErrorMessage>
              )}
            </InputWrapper>

            {apiError && <ErrorMessage>{t(apiError)}</ErrorMessage>}

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("signUp.form.submitButton")}
            </SubmitButton>
          </StyledForm>

          <SignInLink>
            {t("signUp.alreadyHaveAccount")}{" "}
            <Link to="/login">{t("signUp.signInLink")}</Link>
          </SignInLink>
        </FormWrapper>
      </FormContainer>
      <ImageContainer />
    </PageContainer>
  );
}
