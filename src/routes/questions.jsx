import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Form,
  Link,
  useSubmit,
  redirect,
  useRouteLoaderData,
} from "react-router-dom";

import { CONSTANTS } from "@/constants.js";
import Notification from "@/components/notification.jsx";

const preset_questions = [
  "What's most difficult in your role right now?",
  "What have you learned recently?",
  "What do you look forward to right now?",
  "Which colleague has been most helpful recently?",
  "What has made you tired recently?",
  "What's one thing you're grateful for today?",
  "Can you share a recent success or accomplishment you're proud of?",
  "What's something you've learned recently that surprised you?",
  "What's your favorite thing about working with this team?",
  "What's one goal you're currently working towards?",
  "Name a challenge you're facing right now. How can the team support you?",
  "If you could have any superpower, what would it be and why?",
  "What's one skill you'd like to develop further in your role?",
  "If you could travel anywhere in the world right now, where would you go and why?",
  "What's something you're looking forward to in the upcoming week?",
  "Can you share a piece of advice that has had a significant impact on you?",
];

export default function Questions() {
  const routedata = useRouteLoaderData("root");
  const submit = useSubmit();

  const _addPreset = () => {
    document.querySelector("textarea[name='questions']").value =
      listToLines(preset_questions);
  };

  const _handleSubmit = (e) => {
    const formdata = new FormData(e.currentTarget);
    const values_as_string = formdata.get("questions");
    const question_values = values_as_string.split("\n");
    formdata.delete("questions");
    for (const question of question_values) {
      formdata.append("questions", question);
    }
    submit(formdata, { method: "post", action: "/questions" });
  };

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-zinc-50/75 dark:bg-zinc-800/75 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[40rem] translate-x-[-50%] translate-y-[-50%] rounded-md bg-zinc-100 dark:bg-zinc-900 p-[1rem] shadow-lg focus:outline-none overflow-y-auto scrollbar-thumb-zinc-300 scrollbar-track-zinc-700 scrollbar-thin">
          {!routedata.questions && (
            <Notification>
              <p>
                If you struggle to come up with questions you can start with{" "}
                <a
                  className="font-bold text-indigo-300 cursor-pointer"
                  onClick={_addPreset}
                >
                  a preset list
                </a>
                .
              </p>
            </Notification>
          )}
          <Form method="post" action="/questions">
            <div className="my-4">
              <Label htmlFor="questions">
                Questions (one question per line)
              </Label>
              <Textarea
                id="questions"
                name="questions"
                rows={20}
                required
                placeholder="Write your questions here. One question per line."
                defaultValue={listToLines(routedata.questions)}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <Link to="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">Save</Button>
            </div>
          </Form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function listToLines(items) {
  if (items) {
    return items.join("\n");
  }
  return null;
}

export async function questionsAction({ request }) {
  const formdata = await request.formData();
  const questions = formdata.get("questions");
  const non_empty_questions = questions.split("\n").filter((q) => q !== "");
  await localStorage.setItem(
    CONSTANTS.SETTINGS_QUESTIONS,
    JSON.stringify(non_empty_questions),
  );
  return redirect("/");
}
