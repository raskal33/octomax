interface ButtonProps {
  variant?: "primary" | "secondary" | "dark";
  font?: 1 | 2;
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Button({
  variant = "primary",
  font = 1,
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  hover = false,
  className = "",
  style,
}: ButtonProps) {
  return (
    <button
      className={`${
        variant == "primary" 
          ? "bg-[#14F195]" 
          : variant == "secondary" 
            ? "bg-[#9945FF]" 
            : "bg-[#121212]"
      } ${
        variant !== "dark" 
          ? "text-black" 
          : "text-gray-300"
      } ${
        font == 1 
          ? "font-normal" 
          : "font-semibold"
      } ${
        fullWidth 
          ? "w-full" 
          : "w-fit"
      } ${
        hover 
          ? "hover:bg-[#00C2FF] hover:text-black" 
          : ""
      } px-4 py-2 text-sm font-bold transition duration-300 hover:-translate-y-2 focus:outline-none ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
