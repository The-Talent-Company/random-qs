import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Link,
  Form,
  useNavigation,
  useActionData,
  useSubmit,
  useRouteLoaderData,
} from "react-router-dom";
import { UserRoundCheck, UserRoundX, Trash2 } from "lucide-react";
import { CONSTANTS } from "@/constants.js";

export default function Names({ inline, size }) {
  const routedata = useRouteLoaderData("root");
  const actiondata = useActionData();
  const navigation = useNavigation();
  const submit = useSubmit();

  if (!size) {
    size = 24;
  }

  const _handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const intent = formdata.get("intent");
    submit(formdata, { method: "post", action: "/names" });
    if (intent === "add") {
      e.currentTarget.reset();
    }
  };

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-zinc-50/75 dark:bg-zinc-800/75 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-zinc-100 dark:bg-zinc-900 p-[1rem] shadow-lg focus:outline-none overflow-y-auto scrollbar-thumb-zinc-300 scrollbar-track-zinc-700 scrollbar-thin">
          {!routedata.apikey && (
            <p className="text-sm">Need an API key to auto-fetch names.</p>
          )}
          {routedata.apikey && (
            <Form className="mb-4" method="post" action="/names">
              <input type="hidden" name="intent" value="fetch-alexis" />
              <input type="hidden" name="apikey" value={routedata.apikey} />
              <Button disabled={navigation.state !== "idle"} type="submit">
                Read from AlexisHR
              </Button>
            </Form>
          )}
          {actiondata?.message && (
            <div className="bg-red-800 text-zinc-100 rounded-md p-4 text-sm">
              <p>{actiondata.message}</p>
            </div>
          )}
          <div className="space-y-2 mt-4">
            {routedata.names &&
              routedata.names
                .sort((a, b) =>
                  a.name < b.name ? -1 : a.name === b.name ? 0 : 1,
                )
                .map((name) => {
                  return (
                    <div key={name.id} className="flex justify-between">
                      <span>{name.name}</span>
                      <span className="flex space-x-4">
                        <Form onSubmit={_handleSubmit}>
                          <input type="hidden" name="id" value={name.id} />
                          <input type="hidden" name="intent" value="toggle" />
                          <button
                            type="submit"
                            title={`Click to ${
                              name.active ? "disable" : "enable"
                            }`}
                          >
                            {name.active ? (
                              <UserRoundCheck
                                strokeWidth={2}
                                className="cursor-pointer stroke-[#65e3ab]"
                                title="Click to disable"
                              />
                            ) : (
                              <UserRoundX
                                strokeWidth={1}
                                className="cursor-pointer stroke-[#ff634d]"
                              />
                            )}
                          </button>
                        </Form>
                        <Form method="post" action="/names">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="id" value={name.id} />
                          <button type="submit">
                            <Trash2
                              strokeWidth={1}
                              className="cursor-pointer"
                            />
                          </button>
                        </Form>
                      </span>
                    </div>
                  );
                })}
          </div>
          <Form onSubmit={_handleSubmit}>
            <div className="flex w-full items-center gap-2 mt-4">
              <input type="hidden" name="intent" value="add" />
              <Input type="text" placeholder="Add name" name="name" required />
              <Button type="submit">Add</Button>
            </div>
          </Form>
          <div className="mt-4 flex justify-end space-x-4">
            <Link to="/">
              <Button type="button" variant="ghost">
                <Dialog.Close>Close</Dialog.Close>
              </Button>
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>{" "}
    </Dialog.Root>
  );
}

export async function namesAction({ request }) {
  const formdata = await request.formData();
  const intent = formdata.get("intent");

  switch (intent) {
    case "add": {
      const new_name = formdata.get("name");
      const stored_names = await _getNamesFromLS();
      stored_names.push({
        id: `${Date.now()}`,
        name: new_name,
        active: true,
      });
      await _writeNamesToLS(stored_names);
      return null;
    }
    case "delete": {
      const id = formdata.get("id");
      const stored_names = await _getNamesFromLS();
      const name_obj = stored_names.filter((name) => name.id === id)[0];
      const idx = stored_names.indexOf(name_obj);
      stored_names.splice(idx, 1);
      await _writeNamesToLS(stored_names);
      return null;
    }
    case "toggle": {
      const id = formdata.get("id");
      const stored_names = await _getNamesFromLS();
      const name_obj = stored_names.filter((name) => name.id === id)[0];
      const idx = stored_names.indexOf(name_obj);
      stored_names[idx] = { ...name_obj, active: !name_obj.active };
      await _writeNamesToLS(stored_names);
      return null;
    }
    case "fetch-alexis": {
      const formdata_obj = Object.fromEntries(formdata);
      const response = await fetch("/api/alexis", {
        method: "post",
        body: JSON.stringify({ apikey: formdata_obj.apikey }),
      });
      if (!response.ok) {
        return response;
      }
      const response_json = await response.json();
      const stored_names = await _getNamesFromLS();
      for (const alexis_name of response_json) {
        stored_names.push({
          id: alexis_name.id,
          name: `${alexis_name.firstName} ${alexis_name.lastName}`,
          active: true,
        });
      }
      await _writeNamesToLS(stored_names);
      return null;
    }
  }
}

async function _getNamesFromLS() {
  return await JSON.parse(
    localStorage.getItem(CONSTANTS.SETTINGS_NAMES) || "[]",
  );
}

async function _writeNamesToLS(names) {
  await localStorage.setItem(CONSTANTS.SETTINGS_NAMES, JSON.stringify(names));
}
