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

  const {
    inputs,
    hasErrors,
    errors,
    hasSubmitted,
    onInput,
    setInputs,
    setHasSubmitted,
  } = useForm({ title: conversation.title || "" }, { title: titleValidation });

  async function onRemoveTitleClick() {
    const result = await executeUpdateTitle(null);

    if (!result.isError) {
      setInputs({ title: "" });
    }
  }

  async function onUpdateTitleClick() {
    setHasSubmitted(true);

    if (!hasErrors) {
      await executeUpdateTitle(inputs.title === "" ? null : inputs.title);
    }
  }

  async function executeUpdateTitle(title: string | null) {
    const result = await updateTitle.execute({
      conversationId: conversation.conversationId,
      title,
    });

    if (result.error) {
      toast({
        title: "Failed to update title, please try again.",
        description: result.error.message,
      });

      return { isError: true };
    }

    return { isError: false };
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
      {hasSubmitted && errors.title && (
        <ErrorMessage>{errors.title}</ErrorMessage>
      )}
      <div className={styles.buttons}>
        <Button
          color="ghost"
          disabled={updateTitle.isLoading}
          spinner={updateTitle.isLoading}
          onClick={onRemoveTitleClick}
        >
          Remove title
        </Button>
        <Button
          color="foreground"
          disabled={updateTitle.isLoading}
          spinner={updateTitle.isLoading}
          onClick={onUpdateTitleClick}
        >
          Update title
        </Button>
      </div>
    </>
  );
}
