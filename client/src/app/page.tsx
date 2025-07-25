import LeftNavBar from "@/components/nav/LeftNavBar";
import BottomNavBar from "@/components/nav/BottomNavBar";

export default function Home() {
  return (
    <div>
      <LeftNavBar />
      <main className="min-h-screen   text-black text-3xl font-heading flex items-center justify-center ">
        ✅ Tailwind Colors Now Work
      </main>
      <div className=" text-white p-4">Tailwind Base Color</div>
      <BottomNavBar />
    </div>
  );
}
