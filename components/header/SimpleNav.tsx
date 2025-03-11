import Link from "next/link";
import Button from "../button";

export default function SimpleNav({
  handleClose,
}: {
  handleClose: () => void;
}) {
  // Return an empty nav element since we're removing the buttons
  return <nav className={`mb-6 w-full`}></nav>;
}
