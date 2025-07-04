import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import Select from "react-select";

enum Gender {
  male = "male",
  female = "female",
  other = "other"
}

type IceCreamOption = {
  value: string;
  label: string;
}

type FormData = {
    fname: string;
    email: string;
    password: string;
    gender: Gender;
    age: number;
    terms: boolean;
    icecream: IceCreamOption | null; 
}

const icecream = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]


const HookForm = () => {

  const {register, handleSubmit,setError, formState:{errors, isSubmitting}, control } = useForm<FormData>({
    defaultValues: {
      fname: "",
      email: "",
      password: "",
      gender: Gender.female,
      age: 0,
      terms: false,
      icecream: null 
    }
  });

  const onSubmit : SubmitHandler<FormData> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      console.log("Form submitted successfully:", data);
      throw new Error("Simulated error for testing"); 
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
      <h1 className="text-3xl font-bold underline mb-4">React Hook Forms</h1>
      {errors.root && (
        <p className="text-red-500 mb-4">{errors.root.message}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}> 
        <div className="form-group py-4">
          <label className="px-4">First Name</label>
          <input {...register("fname", {
            required: "First name is required",
            maxLength: {
              value: 20,
              message: "First name must be less than 20 characters"
            },
            minLength: {
              value: 3,
              message: "First name must be at least 3 characters long"
            },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "First name must contain only letters"
            },
            validate: (value) => {
              if (value.toLowerCase() === "admin") {
                return "This name is not allowed";
              }
              return true;
            }
          })} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="enter first name" />
          {errors.fname && <p className="text-red-500">{errors.fname?.message}</p>}
        </div>
        <div className="form-group py-2">
          <label className="px-4">Email</label>
          <input {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format"
            }
          })} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" placeholder="enter email" />
          {errors.email && <p className="text-red-500">{errors.email?.message}</p>}
        </div>
        <div className="form-group py-4">
          <label className="px-4">Password</label>
          <input {...register("password", {
            required: "Password is required",
            minLength: {
              value: 4,
              message: "Password must be at least 4 characters long"
            },
            maxLength: {
              value: 10,
              message: "Password must be less than 10 characters"
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/,
              message: "Password must contain at least one letter and one number"
            }
          })} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="enter password" />
          {errors.password && <p className="text-red-500">{errors.password?.message}</p>}
        </div>
        <div className="form-group py-4">
          <label className="px-4">Gender</label>
            <select {...register("gender",{
              required: "Select any one option",
              validate: (value) => {
                if(["female","male","other"].includes(value)) {
                  return true;
                }
                return "Invalid Selection";
              }
            })} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select One</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
            </select>
          {errors.gender && <p className="text-red-500">{errors.gender?.message}</p>}
        </div>
        <div className="form-group py-4">
          <label className="px-4">Age</label>
          <input {...register("age",{
            required: "Age is required",
            min: {
              value: 18,
              message: "You must be at least 18 years old"
            },
            max: {
              value: 100,
              message: "Age must be less than or equal to 100"
            }
          })} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" placeholder="enter age" />
          {errors.age && <p className="text-red-500">{errors.age?.message}</p>}
        </div>        
        <div className="form-group py-4">
            <input {...register("terms",{
              required: "You must accept the terms and conditions"              
            })} type="checkbox"/>
            <label className="px-2">Terms and Conditions</label>  
            {errors.terms && <p className="text-red-500">{errors.terms?.message}</p>}        
        </div>
        <div  className="w-1/2 flex flex-col py-4">
          <Controller 
          name="icecream"
          control = {control}
          // defaultValue = ""
          rules={{
            validate: (value: any) => 
              value && value.length > 0 ? true : "Please select an ice cream flavor"
            
          }}
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

export default HookForm
