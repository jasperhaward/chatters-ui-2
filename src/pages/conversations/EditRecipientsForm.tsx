import { useState } from "preact/hooks";

import { UseQuery, useCreateRecipient, useRemoveRecipient } from "@/api";
import { ErrorMessage, Multiselect, MultiselectOption } from "@/components";
import { Conversation, User } from "@/types";
import { useToasts } from "@/features/toasts";
import { useSession } from "@/features/auth";

import { sortUsersByUsername, toUserMultiselectOption } from "./utils";

interface EditRecipientsFormProps {
  conversation: Conversation;
  contacts: UseQuery<User[]>;
}

export default function EditRecipientsForm({
  conversation,
  contacts,
}: EditRecipientsFormProps) {
  const [toast] = useToasts();
  const [session] = useSession();
  const createRecipient = useCreateRecipient();
  const removeRecipient = useRemoveRecipient();

  const nonUserRecipients = conversation.recipients.filter(
    (recipient) => recipient.id !== session.user.id
  );

  const [recipients, setRecipients] = useState<User[]>(nonUserRecipients);

  async function onRecipientAdded(option: MultiselectOption) {
    const result = await createRecipient.execute({
      conversationId: conversation.conversationId,
      recipientId: option.id,
    });

    if (result.error) {
      toast({
        title: "Failed to add recipient, please try again.",
        description: result.error.message,
      });
    } else {
      const addedRecipient = contacts.data!.find(
        (contact) => contact.id === option.id
      )!;

      const updatedRecipients = [...recipients, addedRecipient];

      setRecipients(updatedRecipients.sort(sortUsersByUsername));
    }
  }

  async function onRecipientRemoved(option: MultiselectOption) {
    const result = await removeRecipient.execute({
      conversationId: conversation.conversationId,
      recipientId: option.id,
    });

    if (result.error) {
      toast({
        title: "Failed to remove recipient, please try again.",
        description: result.error.message,
      });
    } else {
      const updatedRecipients = nonUserRecipients.filter(
        (recipient) => recipient.id !== option.id
      );

      setRecipients(updatedRecipients);
    }
  }

  function toMultiselectValue(user: User): MultiselectOption {
    return {
      ...toUserMultiselectOption(user),
      // disallow removing a recipient when the conversation contains only 2 recipients
      disabled: recipients.length === 1,
    };
  }

  return (
    <Multiselect
      placeholder="Enter a username..."
      disabled={
        contacts.isLoading ||
        !!contacts.error ||
        createRecipient.isLoading ||
        removeRecipient.isLoading
      }
      description={
        contacts.error ? (
          <ErrorMessage>
            Failed to load contacts, please refresh the page.
          </ErrorMessage>
        ) : (
          <p>To add a recipient, select a user from your contacts above</p>
        )
      }
      value={recipients.map(toMultiselectValue)}
      options={contacts.data?.map(toUserMultiselectOption) || []}
      onAdd={onRecipientAdded}
      onRemove={onRecipientRemoved}
    />
  );
}
