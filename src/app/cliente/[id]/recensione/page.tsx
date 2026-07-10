import { notFound } from "next/navigation";
import { pb, getCollectionName } from "@/lib/pocketbase";
import type { WrittenReviewData } from "@/app/actions";
import ClientReview from "./ClientReview";

export const revalidate = 0;

type ClientReviewRecord = {
  id: string;
  fullName?: string;
  businessName?: string;
  writtenReview?: WrittenReviewData;
};

export default async function ClientReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token = "" } = await searchParams;
  let record: ClientReviewRecord;

  try {
    record = await pb.collection(getCollectionName()).getOne<ClientReviewRecord>(id);
  } catch (error) {
    console.error("Error fetching client review record:", error);
    notFound();
  }

  const writtenReview = record.writtenReview || {};
  const isValidLink = Boolean(writtenReview.token && writtenReview.token === token);

  return (
    <ClientReview
      recordId={record.id}
      token={token}
      fullName={record.fullName}
      businessName={record.businessName}
      initialReview={writtenReview}
      isValidLink={isValidLink}
    />
  );
}
