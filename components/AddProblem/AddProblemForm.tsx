"use client";

import { SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "@/lib/editor";
import { baseInput } from "@/style/baseStyle";

const ReactEditorJS = createReactEditorJS();

/*
  title String
  description String
  difficulty String
  tags String[]
  memoryLimit Int
  timeLimit Int
  input String
  output String
  sampleInput String
  sampleOutput String
 */
interface InputValue {
  title: string;
  description: string;
  difficulty: string;
  input: string;
  output: string;
  sampleInput: string;
  sampleOutput: string;
  timeLimit: number;
  memoryLimit: number;
}

const inputs = [
  {
    id: "title",
    label: "Title",
    required: true,
  },
  {
    id: "description",
    label: "Description",
    required: true,
  },
  {
    id: "difficulty",
    label: "Difficulty",
    required: true,
  },
  {
    id: "input",
    label: "Input",
    required: true,
  },
  {
    id: "output",
    label: "Output",
    required: true,
  },
  {
    id: "sampleInput",
    label: "Sample Input",
    required: true,
  },
  {
    id: "sampleOutput",
    label: "Sample Output",
    required: true,
  },
  {
    id: "timeLimit",
    label: "Time Limit",
    required: true,
  },
  {
    id: "memoryLimit",
    label: "Memory Limit",
    required: true,
  },
];

const inputStyle = baseInput;

const InputRow = ({
  id,
  label,
  register,
  required = true,
}: {
  id: keyof InputValue;
  label: string;
  register: UseFormRegister<InputValue>;
  required?: boolean;
}) => {
  return (
    <span className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={inputStyle} {...register(id, { required })} />
    </span>
  );
};

const AddProblemForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InputValue>();

  const router = useRouter();

  const onSubmit: SubmitHandler<InputValue> = async (data) => {
    const { data: problem } = await axios.post("/api/problem", data);
    router.push(`/problems/${problem.id}`);
  };

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      {inputs.map((input) => (
        <InputRow
          key={input.id}
          label={input.label}
          register={register}
          required={input.required}
          id={input.id as any}
        />
      ))}

      <input type="submit" />
    </form>
  );
};

export default AddProblemForm;
