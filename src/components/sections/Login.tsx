// "use client";

import { Container, InputAdornment, TextField } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import React, { useState } from "react";
import Logo from "../Logo";
import { LoadingButton } from "@mui/lab";
import { object, string } from "yup";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from "libphonenumber-js";
import axios from "axios";

export interface LoginFormData {
  UserName: string;
  OTP?: string;
}

const LoginSchema = object().shape({
  UserName: string().required("Email / PhoneNumber is required"),
});

export default function Login() {
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [resend, setResend] = useState<boolean>(false);

  const methods = useForm<LoginFormData>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      UserName: "",
      OTP: "",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting, errors, submitCount },
    register,
    setError,
    getValues,
  } = methods;

  const HandleLogin = async (values: LoginFormData) => {
    try {
      const { UserName, OTP } = values;
      let ParsedUserName = UserName;
      const IfNumber = parsePhoneNumberFromString(UserName, "IN");
      if (IfNumber && isValidPhoneNumber(IfNumber?.number || "")) {
        ParsedUserName = IfNumber.number;
      }

      if (showOtp) {
        const res = await signIn("credentials", {
          ParsedUserName,
          OTP,
          redirect: false,
        });
        if (!res?.ok) {
          setError("OTP", {
            type: "manual",
            message: res?.error?.replace(/\./g, ""),
          });
          if (res?.error === "User does not exist.") {
            setError("UserName", {
              type: "manual",
              message: res?.error?.replace(/\./g, ""),
            });
          }
        } else {
          window.location.replace("/");
        }
      } else {
        await axios({
          url: "/api/check-username",
          method: "POST",
          data: {
            UserName: ParsedUserName,
            reqOtp: true,
          },
        });
        setShowOtp(true);
      }
    } catch (error: any) {
      console.log(error);

      setError("OTP", {
        type: "manual",
        message: error?.response?.data?.message?.replace(/\./g, ""),
      });
      if (error?.response?.data?.message === "User does not exist.") {
        setError("UserName", {
          type: "manual",
          message: error?.response?.data?.message?.replace(/\./g, ""),
        });
      }
    }
  };
  const HandleResend = async () => {
    setResend(true);
    let UserName = getValues("UserName").trim();
    const IfNumber = parsePhoneNumberFromString(UserName, "IN");
    if (IfNumber && isValidPhoneNumber(IfNumber?.number || "")) {
      UserName = IfNumber.number;
    }
    await axios({
      url: process.env.NEXT_PUBLIC_BASE_URL + "auth/auth/CheckUserName",
      method: "POST",
      data: {
        UserName: UserName,
        reqOtp: true,
      },
    });
    setResend(false);
  };
  return (
    <>
      <Logo
        disabledLink
        sx={{
          width: "100%",
          height: "7vh",
          mt: 6,
        }}
      />
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
        }}
        component="form"
        autoComplete="off"
      >
        {!showOtp ? (
          <TextField
            margin="normal"
            variant="filled"
            autoFocus
            error={Boolean(errors?.UserName?.message)}
            helperText={errors?.UserName?.message}
            label="Mobile Number or Email"
            fullWidth
            {...register("UserName")}
          />
        ) : (
          <TextField
            margin="normal"
            fullWidth
            label="OTP"
            variant="filled"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LoadingButton loading={resend} onClick={HandleResend}>
                    Resend
                  </LoadingButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 6,
            }}
            autoFocus
            error={Boolean(errors?.OTP?.message)}
            helperText={errors?.OTP?.message}
            {...register("OTP")}
          />
        )}
        <LoadingButton
          loading={isSubmitting}
          onClick={handleSubmit(HandleLogin)}
          type="submit"
          variant="contained"
          fullWidth
        >
          {showOtp ? "Login" : " Get OTP"}
        </LoadingButton>
      </Container>
    </>
  );
}
