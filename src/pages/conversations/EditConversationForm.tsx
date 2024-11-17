import { useState } from "preact/hooks";
import styles from "./EditConversationForm.module.scss";

import {
  UseQuery,
  useUpdateTitle,
  useCreateRecipient,
  useRemoveRecipient,
} from "@/api";
import { ValidationRules, useForm } from "@/hooks";
import {
  Button,
  ErrorMessage,
  Input,
  Multiselect,
  MultiselectOption,
} from "@/components";
import { Conversation, User } from "@/types";
import { useToasts } from "@/features/toasts";
import { useSession } from "@/features/auth";

import {
  titleValidation,
  sortUsersByUsername,
  toUserMultiselectOption,
} from "./utils";

interface EditConversationInputs {
  title: string;
}

const validation: ValidationRules<EditConversationInputs> = {
  title: titleValidation,
};

interface EditConversationFormProps {
  conversation: Conversation;
  contacts: UseQuery<User[]>;
}

export default function EditConversationForm({
  conversation,
  contacts,
}: EditConversationFormProps) {
  const [toast] = useToasts();
  const [session] = useSession();
  const updateTitle = useUpdateTitle();
  const createRecipient = useCreateRecipient();
  const removeRecipient = useRemoveRecipient();

  const nonUserRecipients = conversation.recipients.filter((recipient) => {
    return recipient.id !== session.user.id;
  });

  const [recipients, setRecipients] = useState<User[]>(nonUserRecipients);
  // prettier-ignore
  const {
    inputs,
    hasErrors,
    errors,
    hasSubmitted,
    onInput,
    setHasSubmitted,
  } = useForm<EditConversationInputs>(
    { title: conversation.title || "" },
    validation
  );

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

  async function onUpdateTitleClick() {
    setHasSubmitted(true);

    if (!hasErrors) {
      const result = await updateTitle.execute({
        conversationId: conversation.conversationId,
        title: inputs.title === "" ? null : inputs.title,
      });

      if (result.error) {
        toast({
          title: "Failed to update title, please try again.",
          description: result.error.message,
        });
      }
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
    <>
      <label>Recipients</label>
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
            <p>Chose from your contacts</p>
          )
        }
        value={recipients.map(toMultiselectValue)}
        options={contacts.data?.map(toUserMultiselectOption) || []}
        onAdd={onRecipientAdded}
        onRemove={onRecipientRemoved}
      />
      <label>Title (optional)</label>
      <div className={styles.title}>
        <Input
          name="title"
          autoComplete="off"
          disabled={updateTitle.isLoading}
          value={inputs.title}
          onInput={onInput}
        />
        <Button
          color="foreground"
          disabled={updateTitle.isLoading}
          spinner={updateTitle.isLoading}
          onClick={onUpdateTitleClick}
        >
          Save
        </Button>
      </div>
      {hasSubmitted && errors.title && (
        <ErrorMessage>{errors.title}</ErrorMessage>
      )}
    </>
  );
}
