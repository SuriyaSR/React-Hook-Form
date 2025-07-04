import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import Select from "react-select";
import z from "zod";

const icecream = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

const icecreamOptionSchema = z.object({
  value: z.string(),
  label: z.string()
});

const formSchema = z.object({
    fname: z.string()
        .min(3, "First name must be at least 3 characters long")
        .max(20, "First name must be less than 20 characters")
        .regex(/^[A-Za-z]+$/, "First name must contain only letters")
        .refine(value => value.toLowerCase() !== "admin", {
        message: "This name is not allowed"
        }),
    
    email: z.string()
        .email("Invalid email format").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
    
    password: z.string()
        .min(4, "Password must be at least 4 characters long")
        .max(10, "Password must be less than 10 characters")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/, "Password must contain at least one letter and one number"),
    gender: z.enum([
        "male", "female", "other"
    ], {message: "Select any one option"}),
    age: z.number()
        .min(18, "You must be at least 18 years old")
        .max(100, "Age must be less than or equal to 100"),
    terms: z.boolean().refine(val => val === true, {
      message: "You must accept the terms and conditions",
    }),
    icecream: z.array(icecreamOptionSchema).min(1, "Please select at least one ice cream flavor"),
})

type FormData = z.infer<typeof formSchema>;

const HookFormWithZod = () => {

  const {register, handleSubmit,setError, formState:{errors, isSubmitting}, control } = useForm<FormData>({
    defaultValues: {
      fname: "",
      email: "",
      password: "",
      gender: "male",
      age: 18,
      terms: false,
      icecream: [] 
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit : SubmitHandler<FormData> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      console.log("Form submitted successfully:", data);
    //   throw new Error("Simulated error for testing"); 
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("root", {
        type: "manual",
        message: "An error occurred while submitting the form"
      });
    }  
  }  
  
  return (
    <div>
      <h1 className="text-3xl font-bold underline mb-4">React Hook Form With Zod</h1>
      {errors.root && (
        <p className="text-red-500 mb-4">{errors.root.message}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}> 
        <div className="form-group py-4">
          <label className="px-4">First Name</label>
          <input {...register("fname")} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="enter first name" />
          {errors.fname && <p className="text-red-500">{errors.fname?.message}</p>}
        </div>
        <div className="form-group py-2">
          <label className="px-4">Email</label>
          <input {...register("email")} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" placeholder="enter email" />
          {errors.email && <p className="text-red-500">{errors.email?.message}</p>}
        </div>
        <div className="form-group py-4">
          <label className="px-4">Password</label>
          <input {...register("password")} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="enter password" />
          {errors.password && <p className="text-red-500">{errors.password?.message}</p>}
        </div>
        <div className="form-group py-4">
          <label className="px-4">Gender</label>
            <select {...register("gender")} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select One</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
            </select>
          {errors.gender && <p className="text-red-500">{errors.gender?.message}</p>}
        </div>
        <div className="form-group py-4">
          <label className="px-4">Age</label>
          <input {...register("age", {valueAsNumber: true})} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" placeholder="enter age" />
          {errors.age && <p className="text-red-500">{errors.age?.message}</p>}
        </div>        
        <div className="form-group py-4">
            <input {...register("terms")} type="checkbox"/>
            <label className="px-2">Terms and Conditions</label>  
            {errors.terms && <p className="text-red-500">{errors.terms?.message}</p>}        
        </div>
        <div  className="w-1/2 flex flex-col py-4">
          <Controller 
          name="icecream"
          control = {control}
          defaultValue = {[]}          
          render = {({ field }) => (
            <Select {...field} isMulti options={icecream} />
          )}
          />
          {errors.icecream && <p className="text-red-500">{errors.icecream?.message}</p>}
        </div>
        <button className="bg-[#091322] text-white px-8 py-2 rounded-sm text-xl cursor-pointer" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  )
}

export default HookFormWithZod
