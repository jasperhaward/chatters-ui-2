import { useState } from "preact/hooks";
import styles from "./CreateConversationForm.module.scss";

import config from "@/config";
import {
  ApiResponseError,
  CreateConversationParams,
  UseQuery,
  useCreateConversation,
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

interface CreateConversationInputs {
  title: string;
}

const initialInputs: CreateConversationInputs = {
  title: "",
};

export const titleValidation = (value: string) =>
  value.length > config.maxConversationTitleLength
    ? `Must contain less than ${
        config.maxConversationTitleLength + 1
      } characters`
    : null;

const validation: ValidationRules<CreateConversationInputs> = {
  title: titleValidation,
};

export interface CreateConversationFormProps {
  contacts: UseQuery<User[]>;
  onConversationCreated: (conversation: Conversation) => void;
}

export default function CreateConversationForm({
  contacts,
  onConversationCreated,
}: CreateConversationFormProps) {
  const [toast] = useToasts();
  const [recipients, setRecipients] = useState<User[]>([]);
  // prettier-ignore
  const {
    inputs,
    hasErrors,
    errors,
    hasSubmitted,
    onInput,
    setHasSubmitted,
  } = useForm(initialInputs, validation);

  const createConversation = useCreateConversation();

  const isNoRecipientsSelected = recipients.length === 0;

  function onRecipientAdded(option: MultiselectOption) {
    const contact = contacts.data!.find((contact) => {
      return contact.id === option.id;
    })!;

    setRecipients([...recipients, contact]);
  }

  function onRecipientRemoved(option: MultiselectOption) {
    const updatedRecipients = recipients.filter((recipient) => {
      return recipient.id !== option.id;
    });

    setRecipients(updatedRecipients);
  }

  async function onCreateConversationClick() {
    setHasSubmitted(true);

    if (!hasErrors && !isNoRecipientsSelected) {
      const params: CreateConversationParams = {
        title: inputs.title === "" ? undefined : inputs.title,
        recipientIds: recipients.map((recipient) => recipient.id),
      };

      const result = await createConversation.execute(params);

      if (result.error) {
        toast({
          title: "Failed to create the converation, please try again.",
          description: formatConversationCreationError(result.error),
        });
      } else {
        onConversationCreated(result.data);
      }
    }
  }

  function formatConversationCreationError(error: Error) {
    if (
      error instanceof ApiResponseError &&
      error.reponse.code === "ExistingDirectConversation"
    ) {
      return `Direct conversation with the selected recipient already exists`;
    }

    return error.message;
  }

  function toMultiselectOption(user: User): MultiselectOption {
    return {
      id: user.id,
      value: user.username,
      icon: ["fas", "user"],
    };
  }

  return (
    <>
      <label>Recipients</label>
      <Multiselect
        placeholder="Enter a username..."
        disabled={
          contacts.isLoading || !!contacts.error || createConversation.isLoading
        }
        description={
          contacts.error ? (
            <ErrorMessage>
              Failed to load contacts, please refresh the page.
            </ErrorMessage>
          ) : hasSubmitted && isNoRecipientsSelected ? (
            <ErrorMessage>Must select at least 1 recipient</ErrorMessage>
          ) : (
            <p>Chose from your contacts</p>
          )
        }
        value={recipients.map(toMultiselectOption)}
        options={contacts.data?.map(toMultiselectOption) || []}
        onAdd={onRecipientAdded}
        onRemove={onRecipientRemoved}
      />
      <label>Title (optional)</label>
      <Input
        name="title"
        autoComplete="off"
        disabled={createConversation.isLoading}
        value={inputs.title}
        onInput={onInput}
      />
      {hasSubmitted && errors.title && (
        <ErrorMessage>{errors.title}</ErrorMessage>
      )}
      <Button
        className={styles.createConversation}
        color="foreground"
        disabled={createConversation.isLoading || !!contacts.error}
        spinner={createConversation.isLoading}
        onClick={onCreateConversationClick}
      >
        Create conversation
      </Button>
    </>
  );
}
