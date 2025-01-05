import styles from "./EditTitleForm.module.scss";

import { useUpdateTitle } from "@/api";
import { useForm } from "@/hooks";
import { Button, ErrorMessage, Input } from "@/components";
import { Conversation } from "@/types";
import { useToasts } from "@/features/toasts";

import { titleValidation } from "./utils";

interface EditTitleFormProps {
  conversation: Conversation;
}

export default function EditTitleForm({ conversation }: EditTitleFormProps) {
  const [toast] = useToasts();
  const updateTitle = useUpdateTitle();

  // prettier-ignore
  const {
    inputs,
    hasErrors,
    errors,
    hasSubmitted,
    onInput,
    setHasSubmitted,
  } = useForm({ title: conversation.title || "" }, { title: titleValidation });

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

  return (
    <>
      <Input
        name="title"
        autoComplete="off"
        disabled={updateTitle.isLoading}
        value={inputs.title}
        onInput={onInput}
      />
      {hasSubmitted && errors.title ? (
        <ErrorMessage>{errors.title}</ErrorMessage>
      ) : (
        <p>To remove the title, clear the input and press save</p>
      )}
      <Button
        className={styles.saveButton}
        color="foreground"
        disabled={updateTitle.isLoading}
        spinner={updateTitle.isLoading}
        onClick={onUpdateTitleClick}
      >
        Save
      </Button>
    </>
  );
}
