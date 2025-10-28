import { client } from "@/libs/api";

export default async function KeyesPage() {
  const { data, error } = await client.GET("/exhibitions");

  if (!data?.data) {
    return <div>Maybe error: {JSON.stringify(error)}</div>;
  }

  if (data?.data.length === 0) {
    return <div>No exhibitions found.</div>;
  }

  return (
    <ul className="pl-5 list-disc">
      {data.data.map((exhibition) => (
        <li key={exhibition._id}>
          {exhibition.name} {exhibition.description}
        </li>
      ))}
    </ul>
  );
}
