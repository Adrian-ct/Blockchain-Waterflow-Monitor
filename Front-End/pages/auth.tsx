import axios, { AxiosResponse } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Field, Form, Formik } from "formik";
import showToastMessage from "../utils/showToastMessage";
import { useRecoilState } from "recoil";
import { blockchainKeysAtom } from "../atoms/atom";
import { BlockchainKeysWithResponse } from "../types/fullstack";
import LoadingSpinner from "../components/LoadingSpinner";
import { set } from "mongoose";
interface IDivicerProps {
  word?: string;
}

const Divider = ({ word }: IDivicerProps) => {
  return (
    <>
      {word ? (
        <div className="flex items-center justify-center gap-2 mb-4 w-full">
          <div className="w-full border-solid border-b-2 rounded-full"></div>
          <div>Or</div>
          <div className="w-full border-solid border-b-2 rounded-full"></div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 mb-6 w-full"></div>
      )}
    </>
  );
};

const Auth: NextPage = ({ providers }: any) => {
  const Router = useRouter();
  const [authType, setAuthType] = useState("Login");
  const oppAuthType: { [key: string]: string } = {
    Login: "Register",
    Register: "Login",
  };

  //Inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Hide/Show password
  const [showPassword, setShowPassword] = useState(false);

  //Blockchain keys state
  const [blockchainKeys, setBlockchainKeys] =
    useRecoilState(blockchainKeysAtom);

  //Loading spinner state
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const redirectToHome = () => {
    const { pathname } = Router;
    if (pathname === "/auth") {
      Router.push("/");
    }
  };

  const loginUser = async () => {
    setLoading(true);
    const res: any = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
      callbackUrl: `${window.location.origin}`,
    });
    res.error ? showToastMessage(res.error, "error") : redirectToHome();
    setLoading(false);
  };

  const formSubmit = (actions: any) => {
    actions.setSubmitting(false);

    authType === "Login" ? loginUser() : registerUser();
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      const res: any = await axios.post(
        "/api/register",
        { username, email, password },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res, "res.data");
      const parsedRes: BlockchainKeysWithResponse = res.data;
      console.log(parsedRes);
      setBlockchainKeys({
        publicKey: parsedRes.publicKey,
        privateKey: parsedRes.privateKey,
        show: true,
      });
      await loginUser();
      redirectToHome();
    } catch (error: any) {
      showToastMessage(error.response?.data?.error, "error");
    }
    setLoading(false);
  };

  return (
    <div className="h-3/5 w-[27%] rounded-md m-auto glass bg-gradient-to-br p-12">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-2xl text-white">{authType}</h1>
        <div className="text-sm mb-6 text-white w-full">
          <div className="flex gap-x-2 justify-center items-center">
            {authType === "Login"
              ? "Not registered yet?"
              : "Already have an account? "}
            <button onClick={() => setAuthType(oppAuthType[authType])}>
              <div className="text-white underline font-bold">
                {oppAuthType[authType]}
              </div>
            </button>
          </div>
          <Divider word="Or" />
          <Formik
            initialValues={{}} // { email: "", password: "" }
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(_, actions) => {
              formSubmit(actions);
            }}
          >
            {(props) => (
              <Form style={{ width: "100%" }}>
                <div className="flex flex-col w-full mb-4">
                  {authType === "Register" && (
                    <Field name="username">
                      {() => (
                        <div className="form-control w-full mb-6">
                          <input
                            type="text"
                            className="input input-bordered w-full bg-white text-black"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                          />
                        </div>
                      )}
                    </Field>
                  )}
                  <Field name="email">
                    {() => (
                      <div className="form-control w-full max-w-md mb-6">
                        <input
                          className="input input-bordered w-full max-w-md bg-white text-black"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="password">
                    {() => (
                      <div className="form-control w-full max-w-md mb-6">
                        <input
                          className="input input-bordered w-full max-w-md bg-white text-black"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                        />
                        <button
                          className="btn text-white underline hover:text-amber-400 bg-transparent border-none hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                          type="button"
                        >
                          {showPassword ? "Hide Password" : "Show Password"}
                        </button>
                      </div>
                    )}
                  </Field>
                  <button
                    className={`btn bg-blue-600 border-white text-white hover:bg-white hover:border-blue-600 hover:text-blue-600 mt-6 ${
                      props.isSubmitting && "loading"
                    }`}
                    type="submit"
                  >
                    {authType}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {loading && <LoadingSpinner className="mt-8" />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
