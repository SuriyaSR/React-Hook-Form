/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import simulatedApi from "../api/api";
import { Controller, useFieldArray, useForm, useWatch, type SubmitHandler } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the validation schema using Zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  age: z.number().min(18, "Age must be at least 18").max(100, "Age must be less than or equal to 100"),
  gender: z.enum(['male', 'female', 'other'],{
    message: "Gender is required"
  }),
  address: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
  }),
  hobbies: z.array(z.object({
    name: z.string().min(1, "Hobby name is required"),
  })).min(1, "At least one hobby is required"),
  startDate: z.date().refine(date => date instanceof Date && !isNaN(date.getTime()), {
    message: "Start date is required",
  }),
  subscribe: z.boolean(),
  referral: z.string(),
}).refine(data => {
    if (data.subscribe) {
      return !!data.referral?.trim(); // must not be empty when subscribed
    }
    return true;
  }, {
    path: ["referral"],
    message: "Referral is required when subscribed",
  });

type FormData = z.infer<typeof formSchema>;

const HookFormWithZod: React.FC = () => {

    const {register, formState:{errors, isSubmitting}, control, handleSubmit, setError} = useForm<FormData>({
        defaultValues:{
            firstName: "",
            lastName: "",
            email: "",
            age: 18,
            gender: "" as any,
            address: { city: "", state: "" },
            hobbies: [{ name: "" }],
            startDate: new Date(),
            subscribe: false,
            referral: "",
        },
        resolver: zodResolver(formSchema),
    })

    const subscribe = useWatch({
      control,
      name: "subscribe",
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "hobbies",
    })

    const onSubmit:SubmitHandler<FormData> = async (data) => {
        try {
            const response = await simulatedApi(data);
            console.log("Form submitted successfully:", response);
        } catch (error: any) {
            console.error("Error submitting form:", error);
            setError("root", {
                message: error.message || "An unexpected error occurred",
            });
        }
    };
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 5 }}
    >
      <div>
        <label>First Name</label>
        <input {...register("firstName")}/>
        {errors.firstName && (
          <p style={{ color: "orangered" }}>{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label>Last Name</label>
        <input {...register("lastName")}
        />
        {errors.lastName && (
          <p style={{ color: "orangered" }}>{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label>Email</label>
        <input {...register("email")} />
        {errors.email && <p style={{ color: "orangered" }}>{errors.email.message}</p>}
      </div>

      <div>
        <label>Age</label>
        <input  {...register("age", {
                valueAsNumber: true,
              })}
        />
        {errors.age && <p style={{ color: "orangered" }}>{errors.age.message}</p>}
      </div>

      <div>
        <label>Gender</label>
        <select{...register("gender")}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p style={{ color: "orangered" }}>{errors.gender.message}</p>}
      </div>

      <div>
        <label>Address</label>
        <input {...register("address.city")}
          placeholder="City"
        />
        {errors.address?.city && (
          <p style={{ color: "orangered" }}>{errors.address.city.message}</p>
        )}

        <input {...register("address.state")}
          placeholder="State"
        />
        {errors.address?.state && (
          <p style={{ color: "orangered" }}>{errors.address.state.message}</p>
        )}
      </div>

      <div>
        <label>Start Date</label>
        <Controller
        control={control}
        name="startDate"
        render={({ field }) => (
          <DatePicker selected={field.value} placeholderText="Select Date" onChange={(date: Date | null) => field.onChange(date)}/>
        )}
      />
      </div>

      <div>
        <label>Hobbies</label>
        {fields.map((hobby, index) => (
          <div key={hobby.id}>
            <input
              {...register(`hobbies.${index}.name`)}
              placeholder="Hobby Name"
            />
            {errors.hobbies?.[index]?.name && (
              <p style={{ color: "orangered" }}>{errors.hobbies[index].name.message}</p>
            )}

            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)}>
                Remove Hobby
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ name: "" })}>
          Add Hobby
        </button>
      </div>

      <div>
        <label htmlFor="sub">Subscribe to Newsletter</label>
        <input
          type="checkbox"
          id="sub"
          {...register("subscribe")}
        />
      </div>
  
      {subscribe && (
        <div>
          <label>Referral Source</label>
          <input {...register("referral")}
            placeholder="How did you hear about us?"
          />
          {errors.referral && (
            <p style={{ color: "orangered" }}>{errors.referral.message}</p>
          )}
        </div>
      )}

      {errors.root && <p style={{ color: "red" }}>{errors.root.message }</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default HookFormWithZod;