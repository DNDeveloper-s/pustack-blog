import AuthorDetailsPage from "@/components/AuthorPage/AuthorPage";

type Props = {
  params: { authorId: [string] };
};

export default function AuthorPage(props: Props) {
  const authorId = props.params.authorId;
  return <AuthorDetailsPage authorId={authorId[0]} />;
}
