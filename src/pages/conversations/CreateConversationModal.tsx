import { useMemo, useState } from "preact/hooks";
import styles from "./CreateConversationModal.module.scss";

import config from "@/config";
import { ValidationRules, useForm } from "@/hooks";
import {
  Button,
  ErrorMessage,
  Icon,
  Input,
  Modal,
  Spinner,
  Typeahead,
  TypeaheadOption,
} from "@/components";
import {
  ApiResponseError,
  CreateConversationParams,
  UseQuery,
  useCreateConversation,
} from "@/api";
import { Conversation, User } from "@/types";

interface CreateConversationInputs {
  title: string;
  typeahead: string;
}

const initialInputs: CreateConversationInputs = {
  title: "",
  typeahead: "",
};

const validation: ValidationRules<CreateConversationInputs> = {
  title: (value) =>
    value.length > config.maxConversationTitleLength
      ? `Must contain less than ${
          config.maxConversationTitleLength + 1
        } characters`
      : null,
  typeahead: () => null,
};

export interface CreateConversationModalProps {
  contacts: UseQuery<User[]>;
  onClose: () => void;
  onConversationCreated: (conversation: Conversation) => void;
}

export default function CreateConversationModal({
  contacts,
  onClose,
  onConversationCreated,
}: CreateConversationModalProps) {
  const [recipients, setRecipients] = useState<User[]>([]);
  // prettier-ignore
  const { 
    inputs, 
    hasErrors, 
    errors, 
    hasSubmitted,
    onInput, 
    setInputs,
    setHasSubmitted 
  } = useForm(initialInputs, validation);

  const createConversation = useCreateConversation();

  const typeaheadOptions = useMemo<TypeaheadOption[]>(() => {
    if (!contacts.data) {
      return [];
    }

    const recipientIds = recipients.map((recipient) => recipient.id);

    // remove currently selected recipients from contacts and create typeahead options
    return contacts.data
      .filter((contact) => !recipientIds.includes(contact.id))
      .map((contact) => ({
        id: contact.id,
        value: contact.username,
        icon: ["fas", "user"],
      }));
  }, [recipients, contacts]);

  function onRecipientAdd(option: TypeaheadOption) {
    const selectedContact = contacts.data!.find((contact) => {
      return contact.id === option.id;
    })!;

    setInputs({ typeahead: "" });
    setRecipients([...recipients, selectedContact]);
  }

  function onRecipientRemove(recipient: User) {
    const updatedRecipients = recipients.filter((existingRecipient) => {
      return existingRecipient.id !== recipient.id;
    });

    // ensure the title is cleared when trying to create a direct conversation
    // after previously selecting multiple recipients
    if (updatedRecipients.length === 1) {
      setInputs({ title: "" });
    }

    setRecipients(updatedRecipients);
  }

  async function onCreateConversationClick() {
    setHasSubmitted(true);

    if (!hasErrors && recipients.length > 0) {
      const params: CreateConversationParams = {
        title: inputs.title === "" ? undefined : inputs.title,
        recipientIds: recipients.map((recipient) => recipient.id),
      };

      const result = await createConversation.execute(params);

      if (result.data) {
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

  return (
    <Modal title="Create conversation" onClose={onClose}>
      <label>Recipients</label>
      <Typeahead
        name="typeahead"
        placeholder="Type a username..."
        value={inputs.typeahead}
        disabled={contacts.isLoading || !!contacts.error}
        options={typeaheadOptions}
        onInput={onInput}
        onSelect={onRecipientAdd}
      />
      {contacts.error ? (
        <ErrorMessage>
          Failed to load contacts, please refresh the page
        </ErrorMessage>
      ) : hasSubmitted && recipients.length === 0 ? (
        <ErrorMessage>Must select at least 1 recipient</ErrorMessage>
      ) : (
        <p>Chose from your contacts</p>
      )}
      <div className={styles.recipients}>
        {recipients.map((recipient) => (
          <Button
            key={recipient.id}
            className={styles.pill}
            color="foreground"
            onClick={() => onRecipientRemove(recipient)}
          >
            {recipient.username}
            <Icon icon={["fas", "times"]} />
          </Button>
        ))}
      </div>
      {recipients.length > 1 && (
        <>
          <label>Title</label>
          <Input
            name="title"
            autoComplete="off"
            disabled={contacts.isLoading}
            value={inputs.title}
            onInput={onInput}
          />
          {hasSubmitted && errors.title ? (
            <ErrorMessage>{errors.title}</ErrorMessage>
          ) : (
            <p>Set an optional title</p>
          )}
        </>
      )}
      {createConversation.error && (
        <ErrorMessage>
          {formatConversationCreationError(createConversation.error)}
        </ErrorMessage>
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
    </Modal>
  );
}
