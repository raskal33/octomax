interface SimpleNavProps {
  handleClose: () => void;
}

export default function SimpleNav({ handleClose }: SimpleNavProps) {
  return (
    <nav className="mb-6 w-full"></nav>
  );
}