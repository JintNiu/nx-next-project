export default function Page({ params }: { params: { id: string } }) {
  return <div>My Blog: {params.id}</div>;
}
