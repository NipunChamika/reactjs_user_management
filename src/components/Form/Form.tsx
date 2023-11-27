// import React from "react";
// import { loginSchema, signupSchema } from "../validation/validation";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   error: string;
//   setError: (error: string) => void;
//   onSubmit: (data: LoginFormData | SignupFormData) => void;
//   formType: "login" | "signup";
// }

// type LoginFormData = z.infer<typeof loginSchema>;
// type SignupFormData = z.infer<typeof signupSchema>;

// type validationSchema = LoginFormData | SignupFormData;

// const navigate = useNavigate();

// const Form = ({ error, setError, onSubmit, formType }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<validationSchema>({ resolver: zodResolver(formType === "login" ? loginSchema : signupSchema) });

//   return (
//     <>
//       <div className="bg-dark vh-100 d-flex justify-content-center align-items-center">
//         <div className="shadow-sm bg-light bg-gradient p-3 w-25 rounded">
//           {error && <p className="text-danger">{error}</p>}
//           <form onSubmit={handleSubmit(onSubmit)}>
//             {formType === "signup" && (
//               <>
//                 <div className="mb-3">
//                   <label htmlFor="firstName" className="form-label">
//                     <strong>First Name</strong>
//                   </label>
//                   <input
//                     {...register("firstName" as const)}
//                     id="firstName"
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter your first name"
//                   />
//                   {errors.firstName && (
//                     <p className="text-danger">{errors.firstName.message}</p>
//                   )}
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="lastName" className="form-label">
//                     <strong>Last Name</strong>
//                   </label>
//                   <input
//                     {...register("lastName")}
//                     id="lastName"
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter your lastName"
//                   />
//                   {errors.lastName && (
//                     <p className="text-danger">{errors.lastName.message}</p>
//                   )}
//                 </div>
//               </>
//             )}

//             <div className="mb-3">
//               <label htmlFor="email" className="form-label">
//                 <strong>Email</strong>
//               </label>
//               <input
//                 {...register("email")}
//                 id="email"
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your email"
//               />
//               {errors.email && (
//                 <p className="text-danger">{errors.email.message}</p>
//               )}
//             </div>
//             <div className="mb-3">
//               <label htmlFor="password" className="form-label">
//                 <strong>Password</strong>
//               </label>
//               <input
//                 {...register("password")}
//                 id="password"
//                 type="password"
//                 className="form-control"
//                 placeholder="Enter your password"
//               />
//               {errors.password && (
//                 <p className="text-danger">{errors.password.message}</p>
//               )}
//             </div>

//             {formType === "signup" && (
//               <button type="submit" className="btn btn-success w-100 mb-1">
//                 Submit
//               </button>
//             )}
//             {formType === "login" && (
//               <button className="btn btn-success w-100 mb-1">Login</button>
//             )}
//           </form>
//           {formType === "signup" && (
//             <button
//               className="btn btn-outline-primary w-100"
//               onClick={() => navigate("/login")}
//             >
//               Login
//             </button>
//           )}
//           {formType === "login" && (
//             <button
//               className="btn btn-outline-primary w-100"
//               onClick={() => navigate("/signup")}
//             >
//               Register
//             </button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Form;
