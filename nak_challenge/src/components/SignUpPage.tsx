import React from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { RegisterFormData, useAuthStore } from "../stores/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";

const Container = styled.div`
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 0 0 0 transparent;
  width: 600px;
  max-width: 90vw;
  margin: 60px auto;
  padding: 48px 40px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0px 0 16px 80px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 24px;
  border: none;
  border-radius: 32px;
  background: #f5f5f5;
  font-size: 1.1rem;
  color: #000000;
  font-weight: 500;
  outline: none;
  transition: box-shadow 0.2s;
  &::placeholder {
    color: #bdbdbd;
    opacity: 1;
    font-weight: 500;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 16px;
  padding-left: 50px;
`;

const SignInButton = styled.button`
  border: 1.5px solid #000;
  background: #fff;
  color: #000;
  border-radius: 24px;
  padding: 8px 28px;

  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f5f5f5;
  }
`;

const ArrowButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 24px;
  width: 90px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #222;
  }
`;
const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const Link = styled.a`
        color: #0d6efd;
        font-weight: 600;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    `;
const InputWrapper = styled.div`
  position: relative;
  margin: 10px 80px;
  border-radius: 40px;
`;

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: "errors.nameRequired" }),
    lastName: z.string().min(1, { message: "errors.lastName" }),
    userName: z.string().min(1, { message: "errors.userName" }),
    password: z.string().min(8, { message: "errors.passwordTooShort" }),
    confirmPassword: z.string().min(8, { message: "errors.passwordTooShort" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwordDontMatch",
    path: ["confirmPassword"],
  });

const SignUpForm: React.FC = () => {
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

  const mutation = useMutation({
    mutationFn: async (data: Omit<RegisterFormData, "confirmPassword">) => {
      const ok = await registerUser(data);
      if (!ok) {
        const storeError = useAuthStore.getState().error;
        throw new Error(storeError ?? "errors.registrationFailed");
      }
      return true;
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...apiData } = data;
    mutation.mutate(apiData);
  };
  const isSubmitting = mutation.isPending;

  return (
    <Container>
      <Title> {t("signUp.title")}</Title>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputWrapper>
          <Input
            id="firstName"
            type="text"
            placeholder={t("signUp.form.nameLabel")}
            {...register("firstName")}
          />
          {errors.firstName && (
            <ErrorMessage>{t(errors.firstName.message as string)}</ErrorMessage>
          )}
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            id="lastName"
            placeholder={t("signUp.form.lastName")}
            {...register("lastName")}
          />
          {errors.firstName && (
            <ErrorMessage>{t(errors.firstName.message as string)}</ErrorMessage>
          )}
        </InputWrapper>
        <InputWrapper>
          <Input
            id="userName"
            placeholder={t("signUp.form.userName")}
            type="text"
            {...register("userName")}
          />
          {errors.firstName && (
            <ErrorMessage>{t(errors.firstName.message as string)}</ErrorMessage>
          )}
        </InputWrapper>
        <InputWrapper>
          <Input
            type="password"
            id="password"
            placeholder={t("signUp.form.passwordLabel")}
            {...register("password")}
          />
          {errors.password && (
            <ErrorMessage>{t(errors.password.message as string)}</ErrorMessage>
          )}
        </InputWrapper>
        <InputWrapper>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t("signUp.form.confirmPassword")}
            {...register("confirmPassword")}
          />
          {errors.password && (
            <ErrorMessage>{t(errors.password.message as string)}</ErrorMessage>
          )}
        </InputWrapper>
        {apiError && <ErrorMessage>{t(apiError)}</ErrorMessage>}

        <Actions>
          <SignInButton type="button" onClick={() => navigate("/login")}>
            {t("signUp.alreadyHaveAccount")}
            <Link href="/login">{t("signUp.signInLink")}</Link>
          </SignInButton>
          <ArrowButton type="submit" disabled={isLoading}>
            {isLoading ? (
              t("common.loading")
            ) : (
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </ArrowButton>
        </Actions>
      </Form>
    </Container>
  );
};

export default SignUpForm;
