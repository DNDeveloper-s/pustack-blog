"use client";

import { useNotification } from "@/context/NotificationContext";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { Button } from "@nextui-org/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

export const appGooglePlayLink =
  "https://play.google.com/store/apps/details?id=com.pustack.android.pustack&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1";

export const appAppleLink = "https://apps.apple.com/app/pustack/id6444080075";

function EmailIcon(props: any) {
  return (
    <svg
      width={25}
      height={25}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g data-name="Layer 29">
        <path d="m12 10.87 9.46-5.55A3 3 0 0 0 19 4H5a3 3 0 0 0-2.48 1.31z" />
        <path d="M13 12.59a2 2 0 0 1-1 .27 2 2 0 0 1-1-.26L2 7.33V17a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7.33z" />
      </g>
    </svg>
  );
}

function MobileIcon(props: any) {
  return (
    <svg
      // width={25}
      height={21}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 384"
      style={{
        enableBackground: "new 0 0 384 384",
      }}
      xmlSpace="preserve"
      {...props}
    >
      <path d="M353.188 252.052c-23.51 0-46.594-3.677-68.469-10.906-10.719-3.656-23.896-.302-30.438 6.417l-43.177 32.594c-50.073-26.729-80.917-57.563-107.281-107.26l31.635-42.052c8.219-8.208 11.167-20.198 7.635-31.448-7.26-21.99-10.948-45.063-10.948-68.583C132.146 13.823 118.323 0 101.333 0h-70.52C13.823 0 0 13.823 0 30.813 0 225.563 158.438 384 353.188 384c16.99 0 30.813-13.823 30.813-30.813v-70.323c-.001-16.989-13.824-30.812-30.813-30.812z" />
    </svg>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      // width={25}
      height={22}
      viewBox="-42 0 512 512.002"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M210.352 246.633c33.882 0 63.222-12.153 87.195-36.13 23.973-23.972 36.125-53.304 36.125-87.19 0-33.876-12.152-63.211-36.129-87.192C273.566 12.152 244.23 0 210.352 0c-33.887 0-63.22 12.152-87.192 36.125s-36.129 53.309-36.129 87.188c0 33.886 12.156 63.222 36.133 87.195 23.977 23.969 53.313 36.125 87.188 36.125zM426.129 393.703c-.692-9.976-2.09-20.86-4.149-32.351-2.078-11.579-4.753-22.524-7.957-32.528-3.308-10.34-7.808-20.55-13.37-30.336-5.774-10.156-12.555-19-20.165-26.277-7.957-7.613-17.699-13.734-28.965-18.2-11.226-4.44-23.668-6.69-36.976-6.69-5.227 0-10.281 2.144-20.043 8.5a2711.03 2711.03 0 0 1-20.879 13.46c-6.707 4.274-15.793 8.278-27.016 11.903-10.949 3.543-22.066 5.34-33.039 5.34-10.972 0-22.086-1.797-33.047-5.34-11.21-3.622-20.296-7.625-26.996-11.899-7.77-4.965-14.8-9.496-20.898-13.469-9.75-6.355-14.809-8.5-20.035-8.5-13.313 0-25.75 2.254-36.973 6.7-11.258 4.457-21.004 10.578-28.969 18.199-7.605 7.281-14.39 16.12-20.156 26.273-5.558 9.785-10.058 19.992-13.371 30.34-3.2 10.004-5.875 20.945-7.953 32.524-2.059 11.476-3.457 22.363-4.149 32.363A438.821 438.821 0 0 0 0 423.949c0 26.727 8.496 48.363 25.25 64.32 16.547 15.747 38.441 23.735 65.066 23.735h246.532c26.625 0 48.511-7.984 65.062-23.734 16.758-15.946 25.254-37.586 25.254-64.325-.004-10.316-.351-20.492-1.035-30.242zm0 0" />
    </svg>
  );
}

function MapIcon(props: any) {
  return (
    <svg
      height={22}
      viewBox="0 0 64 64"
      width={22}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M32 0A24.032 24.032 0 0 0 8 24c0 17.23 22.36 38.81 23.31 39.72a.99.99 0 0 0 1.38 0C33.64 62.81 56 41.23 56 24A24.032 24.032 0 0 0 32 0zm0 35a11 11 0 1 1 11-11 11.007 11.007 0 0 1-11 11z" />
    </svg>
  );
}

function ContactFormInput({ Icon, label, errorMessage, ...props }: any) {
  return (
    <>
      <div className="flex items-center justify-between">
        <label htmlFor={label}>
          {label} <span style={{ color: "red" }}>*</span>
        </label>
        {errorMessage && (
          <span className="!text-xs !text-danger-500">{errorMessage}</span>
        )}
      </div>
      <div className="contact_us-form-input">
        <input name={label} {...props} />
        {Icon && (
          <div className="contact_us-form-input-icon">
            <Icon />
          </div>
        )}
      </div>
    </>
  );
}

/* SmtpJS.com - v3.0.0 */

const RecaptchaComponent = ({ Component }: { Component: any }) => {
  //   const { executeRecaptcha } = useGoogleReCaptcha();
  // Create an event handler so you can call the verification on button click event or form submit
  //   const handleReCaptchaVerify = useCallback(
  //     async (e) => {
  //       if (e) e.preventDefault();
  //       if (!executeRecaptcha) {
  //         console.log("Execute recaptcha not yet available");
  //         return;
  //       }
  //       const token = await executeRecaptcha("yourAction");
  //       // console.log('token - ', token);
  //       // Do whatever you want with the token
  //     },
  //     [executeRecaptcha]
  //   );
  // You can use useEffect to trigger the verification as soon as the component being loaded
  // useEffect(() => {
  // 	handleReCaptchaVerify(null).then();
  // }, [handleReCaptchaVerify]);
  //   return <div onClick={handleReCaptchaVerify}>{Component}</div>;
};

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]+$/, "Please enter a valid phone number"),
  message: Yup.string().required("Message is required"),
});

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const useContact = () => {
  const { openNotification } = useNotification();
  return useMutation({
    mutationFn: async (options: ContactFormValues) => {
      const response = await axios.post(
        "https://us-central1-avian-display-193502.cloudfunctions.net/sendMail",
        {
          data: {
            from: options.email,
            to: "contact@minerva.news",
            message: `
            Name: ${options.name}
            Email: ${options.email}
            Phone Number: ${options.phone}
            Message: ${options.message}
          `,
            subject: "Support",
          },
        }
      );

      if (response.data.result.sendMailSuccess) {
        return response.data;
      }
      throw new Error("Something went wrong, Please try again later!");
    },
    onSuccess: () => {
      openNotification(
        "bottomRight",
        {
          message: "Submitted successfully",
          closable: true,
          duration: 2,
          showProgress: true,
          closeIcon: (
            <p className="underline text-danger cursor-pointer whitespace-nowrap">
              Close
            </p>
          ),
          className: "drafts-notification",
        },
        "success"
      );
    },
    onError: (error) => {
      openNotification(
        "bottomRight",
        {
          message: error.message ?? "Something went wrong",
          closable: true,
          duration: 2,
          showProgress: true,
          closeIcon: (
            <p className="underline text-danger cursor-pointer whitespace-nowrap">
              Close
            </p>
          ),
          className: "drafts-notification",
        },
        "error"
      );
    },
  });
};

export default function ContactUsPage() {
  const validationSchema = useYupValidationResolver(contactSchema);
  const { register, handleSubmit, reset, control } = useForm<ContactFormValues>(
    {
      resolver: validationSchema,
    }
  );

  const { mutate: postContactForm, isPending, isSuccess } = useContact();

  useEffect(() => {
    // Users list that contains the roles
    const users = [
      {
        id: "fsdgdg",
        name: "sdf",
        roles: ["1", "2", "3"],
      },
      {
        id: "fsdgdg",
        name: "sdf",
        roles: ["1", "2", "3"],
      },
      {
        id: "fsdgdg",
        name: "sdf",
        roles: ["1", "2", "3"],
      },
    ];

    const roles = [
      {
        name: "1",
        displayName: "One",
      },
      {
        name: "2",
        displayName: "Two",
      },
      {
        name: "3",
        displayName: "Three",
      },
    ];

    // I want to transform the users list and replace the roles array with the role display names, originally it contains the role names
    // const transformedUsers = users.map((user) => {
    //   return {
    //     ...user,
    //     roles: user.roles.map((role) => {
    //       return roles.find((r) => r.name === role).displayName;
    //     }),
    //   };
    // });
  }, []);

  useEffect(() => {
    if (isSuccess)
      reset({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
  }, [isSuccess, reset]);

  //   const { register, handleChange, form } = useForm({
  //     name: ["", [Validators.req()]],
  //     email: [
  //       "",
  //       [Validators.req(), Validators.test(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
  //     ],
  //     phone: ["", [Validators.req(), Validators.isInt()]],
  //     message: ["", [Validators.req()]],
  //   });
  //   const { show } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [revealed, setRevealed] = useState({ phone: false, email: false });

  const handleSubmitForm = async (data: ContactFormValues) => {
    postContactForm(data);

    // console.log("data - ", data);
  };

  //   async function handleSubmit(e) {
  //     e.preventDefault();
  //     // form.validate();
  //     if (form._invalid) return;
  //     setIsSubmitting(true);
  //     const requestObj = {
  //       name: form.controls.name.value,
  //       email: form.controls.email.value,
  //       phone: form.controls.phone.value,
  //       message: form.controls.message.value,
  //     };
  //     const response = await axios.post(
  //       "https://us-central1-avian-display-193502.cloudfunctions.net/sendMail",
  //       {
  //         data: {
  //           from: form.controls.email.value,
  //           to: "contact@pustack.com",
  //           message: `
  //           Name: ${requestObj.name}
  //           Email: ${requestObj.email}
  //           Phone Number: ${requestObj.phone}
  //           Message: ${requestObj.message}
  //         `,
  //           subject: "Support",
  //         },
  //       }
  //     );
  //     setIsSubmitting(false);
  //     if (response.data.result.sendMailSuccess) {
  //       handleChange({ target: { name: "name", value: "" } });
  //       handleChange({ target: { name: "email", value: "" } });
  //       handleChange({ target: { name: "phone", value: "" } });
  //       handleChange({ target: { name: "message", value: "" } });
  //       show({
  //         title: "Contact Us",
  //         description: "Submitted successfully",
  //         type: "success",
  //       });
  //       // showSnackbar('Submitted successfully.', 'success');
  //       return;
  //     }
  //     console.log(response);
  //     show({
  //       title: "Contact Us",
  //       description: "Something went wrong, Please try again later!",
  //       type: "error",
  //     });
  //     // showSnackbar('Something went wrong.', 'error');
  //   }

  return (
    <div className="contact_us relative h-full my-auto mx-0">
      <div className="contact_us-body flex-1 flex items-center justify-center">
        {/*<div className="contact_us-map-container" style={{width: '100%'}}>*/}
        {/*  <iframe width="100%" height="600" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=28.451220766328596,%2077.09627140867295+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" />*/}
        {/*</div>*/}
        <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // width={1443}
            // height={1401}
            className="w-full h-full"
            fill="none"
          >
            <path
              stroke="#fff"
              strokeMiterlimit={10}
              strokeOpacity={0.16}
              d="M1337.53-46v1472M1233.8-46v1472M1129.97-46v358.442c-.1 22.96-.2 46.637-.31 70.725-.1 23.472-2.15 47.047-5.22 71.647-11.28 104.55-36.9 203.975-22.55 309.55 10.25 78.925 26.65 153.749 27.77 232.264.11 24.192.21 47.762.31 70.722v358.45M1026.24-46v291.817c.82 58.425-7.38 113.775-20.7 172.2-28.704 118.9-84.054 229.599-52.279 353.624 30.75 123 76.879 237.799 72.979 362.539V1426M922.511-46v173.84c-1.538 39.052-5.74 88.457-5.74 130.175-5.535 117.977-44.485 226.627-70.11 345.526-36.9 169.125 51.25 315.7 67.65 477.649 1.025 13.33 3.075 27.68 2.46 40.8 0 41.71 4.202 91.22 5.74 130.17V1426M818.781-46v173.84c-1.23 23.472-1.742 44.69-2.152 66.01-2.768 152.417-32.493 301.042-46.843 453.766-4.1 45.1-1.025 89.175 4.1 134.275 17.425 136.325 38.95 268.549 42.743 404.359.41 21.32.922 42.54 2.152 66.01v173.84M714.949-46V197.54c-.513 328.102-.513 657.126 0 984.92V1426M611.219-46v173.84c1.23 23.472 1.742 44.69 2.152 66.01 2.768 152.417 32.493 301.042 46.843 453.766 4.1 45.1 1.025 89.175-4.1 134.275-17.425 136.325-38.95 268.549-42.743 404.359-.41 21.32-.922 42.54-2.152 66.01v173.84M507.489-46v173.84c1.538 39.052 5.74 88.457 5.74 130.175 5.535 117.977 44.485 226.627 70.11 345.526 36.9 169.125-52.275 315.7-67.65 477.649-1.025 13.33-3.075 27.68-2.46 40.8 0 41.71-4.202 91.22-5.74 130.17V1426M403.759-46v291.817c-2.87 117.875 36.08 226.525 67.855 340.299 16.4 61.5 19.475 121.975 5.125 185.525-29.725 124.025-76.875 237.799-72.98 362.539V1426M299.927-46v358.442c.102 22.96.205 46.637.307 70.725 1.128 84.972 21.628 167.997 29.828 253.072 4.1 43.05 3.075 85.075-2.05 128.125-10.25 78.925-26.65 153.749-27.778 232.264-.102 24.192-.205 47.762-.307 70.722v358.45M196.197-46v1472M92.467-46v1472M1451 1312.53H-21M1451 1208.8H-21"
            />
            <path
              stroke="#fff"
              strokeMiterlimit={10}
              strokeOpacity={0.16}
              d="M1451 1104.97h-358.44c-22.96-.1-46.64-.2-70.73-.31-71.542-1.02-141.242-15.37-214.016-25.62-49.2-7.18-97.375-8.2-146.575-4.1-85.075 8.2-168.1 28.7-252.97 29.72-24.19.11-47.765.21-70.725.31H-20.897M1451 1001.24h-291.82c-126.89 4-241.692-44.177-366.741-73.902-60.475-13.325-117.875-10.25-177.325 5.125-115.825 30.75-225.5 71.747-344.194 68.777H-20.898M1451 897.511h-173.84c-39.05-1.538-88.46-5.74-130.17-5.74-120.85-5.433-231.552-46.433-354.551-72.058-154.775-30.749-287 45.1-434.6 64.575-25.625 3.075-49.2 8.2-74.722 7.483-41.717 0-91.225 4.202-130.175 5.74h-173.84M1451 793.781h-173.84c-23.47-1.23-44.69-1.742-66.01-2.152-131.81-3.588-259.939-23.063-393.189-41.513-69.7-9.225-136.325-9.225-206.025 0-133.249 18.45-261.374 37.925-393.189 41.513-21.32.41-42.537.922-66.01 2.152h-173.84M1451 689.949H1207.46c-327.999-.41-657.023-.41-984.92 0H-21M1451 586.219h-173.84c-23.47 1.23-44.69 1.742-66.01 2.152-135.91 2.87-267.114 25.42-404.464 42.845-52.275 7.175-103.525 8.2-155.8 3.075-145.549-16.4-286.999-43.05-432.139-45.92-21.32-.41-42.537-.922-66.01-2.152h-173.84M1451 482.489h-173.84c-39.05 1.538-88.46 5.74-130.17 5.74-117.78 7.688-226.427 43.563-345.326 70.212-59.45 12.3-113.775 12.3-173.225 0-118.9-26.649-227.55-62.524-345.322-70.212-41.717 0-91.225-4.202-130.175-5.74h-173.84M1451 378.759h-291.82c-118.69-2.767-228.367 37.208-344.191 68.983-66.625 17.425-133.25 17.425-199.875 0-115.825-31.775-225.5-71.75-344.194-68.983H-20.898M1451 274.927h-358.44c-22.96.102-46.64.205-70.73.307-12.09-.82-25.417 1.23-37.717 1.23-111.725 9.225-219.349 39.975-333.124 27.675-82-9.225-160.925-27.675-242.72-28.905-24.19-.102-47.765-.205-70.725-.307H-20.897M1451 171.197H-21M1451 67.467H-21"
            />
          </svg>
          <div className="desktop__overlay" />
        </div>
        <div className="relative contact_us-form items-center">
          {/*<GoogleReCaptchaProvider reCaptchaKey={"6Lcj_tIeAAAAABPRqa9X2CJ3rauTXujhzZEn-C58"}>*/}
          <div className="contact_us-form-group">
            <h2 className="mb-5 text-black">Contact Us</h2>
            <p className="text-black">
              We are looking forward to hearing from you.
            </p>
            <div className="my-3 w-full max-w-[450px] h-[40vh] max-h-[300px]">
              <iframe
                width="100%"
                height="100%"
                src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=Salesforce Tower, Floor 37, San Francisco CA 94105&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              />
            </div>
          </div>
          <form
            onSubmit={handleSubmit(handleSubmitForm, (errors) => {
              console.log("errors - ", errors);
            })}
            className="contact_us-form-group modal"
          >
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <ContactFormInput
                      label="Full Name"
                      value={field.value}
                      onChange={field.onChange}
                      ref={field.ref}
                      errorMessage={fieldState.error?.message}
                      Icon={() => <UserIcon height={20} />}
                    />
                  </>
                );
              }}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <ContactFormInput
                      label="Phone"
                      value={field.value}
                      onChange={field.onChange}
                      ref={field.ref}
                      Icon={() => <MobileIcon height={17} />}
                      errorMessage={fieldState.error?.message}
                    />
                  </>
                );
              }}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <ContactFormInput
                      label="Email"
                      value={field.value}
                      onChange={field.onChange}
                      ref={field.ref}
                      errorMessage={fieldState.error?.message}
                      Icon={() => <EmailIcon height={23} />}
                    />
                  </>
                );
              }}
            />
            <Controller
              name="message"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <label>
                        Your Message <span style={{ color: "red" }}>*</span>
                      </label>
                      {fieldState.error?.message && (
                        <span className="!text-xs !text-danger-500">
                          {fieldState.error?.message}
                        </span>
                      )}
                    </div>
                    <div className="contact_us-form-input textarea !mb-0">
                      <textarea
                        id=""
                        cols={30}
                        rows={3}
                        value={field.value}
                        onChange={field.onChange}
                        ref={field.ref}
                        placeholder="Type your message..."
                      />
                    </div>
                  </>
                );
              }}
            />

            <Button
              type="submit"
              isDisabled={isPending}
              className="mt-4"
              isLoading={isPending}
            >
              Send Message
            </Button>
            {/* <button>
              {isSubmitting ? (
                <Lottie
                  style={{ width: "30px" }}
                  options={{ animationData: circularProgress, loop: true }}
                />
              ) : (
                "Send Message"
              )}
            </button> */}
          </form>
          {/*</GoogleReCaptchaProvider>*/}
        </div>
      </div>
    </div>
  );
}
