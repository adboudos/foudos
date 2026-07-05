import DrinkForm from "@/components/DrinkForm";
import { drinks } from "@/data/drinks";

export default function EditPage({
  params,
}: {
  params: { slug: string };
}) {
  const drink = drinks.find((d) => d.slug === params.slug);

  return (
    <DrinkForm
      //drink={drink}
      //onSave={(data) => {
      //  console.log("UPDATE:", data);
      //}}
    />
  );
}