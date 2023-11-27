// import React, { useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { z } from "zod";
// import { signupSchema } from "./validation/validation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { User } from "../App";
// import { UserContext } from "../context";

// interface Props {}

// type SignupFormData = z.infer<typeof signupSchema>;

// const Update = ({}: Props) => {
//   const navigate = useNavigate();

//   const userContext = useContext(UserContext);
//   //   console.log(userContext);

//   if (userContext === undefined) {
//     console.log("UserContext not available.");
//     navigate("/profile");
//     return null;
//   }

//   const { setUser, userId, setError } = userContext;

//   const accessToken = localStorage.getItem("accessToken");

//   useEffect(() => {
//     if (!accessToken) {
//       navigate("/login");
//       return;
//     }
//   }, [accessToken]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

//   const config = { headers: { Authorization: `Bearer ${accessToken}` } };

//   const onSubmit = (data: SignupFormData) => {
//     console.log(data);
//     console.log(userId);

//     axios
//       .patch("http://localhost:3000/user/" + userId, data, config)
//       .then((res) => {
//         setUser(res.data.user);
//         navigate("/profile");
//       })
//       .catch((err) => {
//         console.log(err);

//         if (err.message === "Network Error") {
//           setError(err.message);
//         } else if (err.response) {
//           setError(err.response.data.message);
//         } else {
//           setError("Something went wrong");
//         }
//       });
//   };

//   return (
//     <>
//       <div className="bg-dark vh-100 d-flex justify-content-center align-items-center">
//         <div className="bg-light p-3 w-50 h-50 rounded shadow-sm">
//           <h1 className="text-center mb-3">User Update</h1>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="mb-3">
//               <label htmlFor="firstName" className="form-label">
//                 <strong>First Name</strong>
//               </label>
//               <input
//                 {...register("firstName")}
//                 id="firstName"
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your first name"
//               />
//               {errors.firstName && (
//                 <p className="text-danger">{errors.firstName.message}</p>
//               )}
//             </div>
//             <div className="mb-3">
//               <label htmlFor="lastName" className="form-label">
//                 <strong>Last Name</strong>
//               </label>
//               <input
//                 {...register("lastName")}
//                 id="lastName"
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your lastName"
//               />
//               {errors.lastName && (
//                 <p className="text-danger">{errors.lastName.message}</p>
//               )}
//             </div>
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
//             <button type="submit" className="btn btn-success w-100 mb-1">
//               Submit
//             </button>
//           </form>
//           <button
//             className="btn btn-outline-primary w-100"
//             onClick={() => navigate("/profile")}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Update;
