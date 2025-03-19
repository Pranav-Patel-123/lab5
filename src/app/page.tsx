// app/page.tsx
import Auth from "@/components/Auth";
import Form from "@/components/Form";

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-6 mt-10">
      <Auth />
      {/* <Form /> */}
    </div>
  );
}
