import { useState } from "preact/hooks";
import styles from "./EditConversationForm.module.scss";

import {
  UseQuery,
  useUpdateConversation,
  useCreateRecipient,
  useDeleteRecipient,
} from "@/api";
import { ValidationRules, useForm } from "@/hooks";
import {
  Button,
  ErrorMessage,
  Input,
  Multiselect,
  MultiselectOption,
} from "@/components";
import { Conversation, Recipient, User } from "@/types";
import { useToasts } from "@/features/toasts";

import { titleValidation } from "./CreateConversationForm";
import { sortUsersByUsername } from "./utils";

interface EditConversationInputs {
  title: string;
}

const validation: ValidationRules<EditConversationInputs> = {
  title: titleValidation,
};

export interface EditConversationFormProps {
  conversation: Conversation;
  contacts: UseQuery<User[]>;
  onConversationUpdated: (conversation: Conversation) => void;
  onRecipientAdded: (recipient: Recipient) => void;
  onRecipientRemoved: (recipient: Recipient) => void;
}

export default function EditConversationForm({
  conversation,
  contacts,
  onConversationUpdated,
  ...props
}: EditConversationFormProps) {
  const [toast] = useToasts();
  const [recipients, setRecipients] = useState<User[]>(conversation.recipients);
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

  const updateConversation = useUpdateConversation();
  const createRecipient = useCreateRecipient();
  const deleteRecipient = useDeleteRecipient();

  const isGroupConversation = conversation.recipients.length > 1;

  async function onRecipientAdded(option: MultiselectOption) {
    const result = await createRecipient.execute({
      conversationId: conversation.id,
      recipientId: option.id,
    });

    if (result.error) {
      toast({
        title: "Failed to add recipient, please try again.",
        description: result.error.message,
      });
    } else {
      const recipient = result.data;
      const updatedRecipients = [...recipients, recipient];

      setRecipients(updatedRecipients.sort(sortUsersByUsername));
      props.onRecipientAdded(recipient);
    }
  }

  async function onRecipientRemoved(option: MultiselectOption) {
    const result = await deleteRecipient.execute({
      conversationId: conversation.id,
      recipientId: option.id,
    });

    if (result.error) {
      toast({
        title: "Failed to remove recipient, please try again.",
        description: result.error.message,
      });
    } else {
      const recipient = conversation.recipients.find(
        (recipient) => recipient.id === option.id
      )!;

      const updatedRecipients = conversation.recipients.filter(
        (recipient) => recipient.id !== option.id
      );

      setRecipients(updatedRecipients);
      props.onRecipientRemoved(recipient);
    }
  }

  async function onUpdateTitleClick() {
    setHasSubmitted(true);

    if (!hasErrors) {
      const result = await updateConversation.execute({
        conversationId: conversation.id,
        title: inputs.title === "" ? null : inputs.title,
      });

      if (result.error) {
        toast({
          title: "Failed to update title, please try again.",
          description: result.error.message,
        });
      } else {
        const updatedConversation: Conversation = {
          ...conversation,
          ...result.data,
        };

        onConversationUpdated(updatedConversation);
      }
    }
  }

  function toMultiselectOption(user: User): MultiselectOption {
    return {
      id: user.id,
      value: user.username,
      icon: ["fas", "user"],
    };
  }

  function toMultiselectValue(user: User): MultiselectOption {
    return {
      ...toMultiselectOption(user),
      // disallow removing a recipient when the conversation contains only 2 recipients
      // as users should not be able to create a direct conversation from a group conversation
      disabled: recipients.length === 2,
    };
  }

  return (
    <>
      {isGroupConversation && (
        <>
          <label>Recipients</label>
          <Multiselect
            placeholder="Enter a username..."
            disabled={
              contacts.isLoading ||
              !!contacts.error ||
              createRecipient.isLoading ||
              deleteRecipient.isLoading
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
            options={contacts.data?.map(toMultiselectOption) || []}
            onAdd={onRecipientAdded}
            onRemove={onRecipientRemoved}
          />
        </>
      )}
      <label>Title (optional)</label>
      <div className={styles.title}>
        <Input
          name="title"
          autoComplete="off"
          disabled={updateConversation.isLoading}
          value={inputs.title}
          onInput={onInput}
        />
        <Button
          color="foreground"
          disabled={updateConversation.isLoading}
          spinner={updateConversation.isLoading}
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
