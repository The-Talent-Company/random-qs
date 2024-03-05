import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPortal } from "react-dom";
import { Form, Link, redirect, useRouteLoaderData } from "react-router-dom";
import Notification from "@/components/notification.jsx";
import { CONSTANTS } from "@/constants.js";

export default function Settings({ inline, size }) {
  const routedata = useRouteLoaderData("root");

  if (!size) {
    size = 24;
  }

  return createPortal(
    <div className="fixed top-0 left-0 flex size-full items-center justify-center bg-zinc-50/75 dark:bg-zinc-800/75">
      <div className="w-[400px] rounded-md bg-zinc-100 dark:bg-zinc-900 p-4 shadow-lg">
        <h2 className="font-bold text-lg">Settings</h2>
        <Form method="post" action="/settings">
          <div className="my-4">
            <Label htmlFor="apikey">Alexis API key</Label>
            <Input
              id="apikey"
              name="apikey"
              type="password"
              default_value={routedata.apikey}
            />
          </div>
          <Notification>
            <p>
              If you're not using AlexisHR you can skip this step. Just add
              names manually.
            </p>
            <p>
              And don't worry about data processing. Everything is stored right
              here in your browser. We don't store anything on our end.
            </p>
          </Notification>
          <div className="mt-4 flex justify-end space-x-4">
            <Link to="/">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Save</Button>
          </div>
        </Form>
      </div>
    </div>,
    document.getElementById("portal"),
  );
}

export async function settingsAction({ request }) {
  const formdata = await request.formData();
  await localStorage.setItem(CONSTANTS.SETTINGS_APIKEY, formdata.get("apikey"));
  return redirect("/");
}
