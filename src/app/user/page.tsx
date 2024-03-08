"use client";
import { AppDispatch } from "@/store";
import { decrement, increment, selectCounter } from "@/store/modules/counterSlice";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

export default function CounterControl() {
  const counter = useSelector(selectCounter);
  const dispatch = useDispatch<AppDispatch>();

  const handleChangeCounter = (type: "ADD" | "MINUS") => {
    dispatch(type === "ADD" ? increment() : decrement());
  };

  return (
    <div>
      <h1>{counter}</h1>
      <div>
        <Button onClick={() => handleChangeCounter("ADD")}>ADD</Button>
        <Button onClick={() => handleChangeCounter("MINUS")}>MINUS</Button>
      </div>
    </div>
  );
}
