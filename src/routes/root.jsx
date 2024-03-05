import { Button } from "@/components/ui/button";
import WheelComponent from "@/components/wheel.jsx";
import { MessageCircleQuestion, Settings, UsersRound } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { CONSTANTS } from "@/constants.js";

import Nav from "@/components/nav.jsx";
import Footer from "@/components/footer.jsx";

export default function Root() {
  const [q_idx, setQidx] = useState();

  const routedata = useLoaderData();

  const _getRandomQ = () => {
    setQidx(
      Math.floor(Math.random() * (routedata.questions.length - 1 - 0 + 1) + 0),
    );
  };

  return (
    <>
      <div className="flex w-full justify-between items-center p-8">
        <div className="font-bold text-xl">Random Qs</div>
        <Nav />
      </div>
      <Outlet />
      {!routedata.names && !routedata.questions && !routedata.apikey && (
        <EmptyState />
      )}
      {!routedata.names && !routedata.questions && routedata.apikey && (
        <div className="max-w-[40rem] mt-24 space-y-4 rounded-md bg-zinc-900 p-8 ml-[450px]">
          <p>You need both questions and names.</p>
          <div className="flex gap-4 mt-4">
            <Link to="/questions">
              <Button>
                Add questions
                <span className="inline-block ml-2">
                  <MessageCircleQuestion strokeWidth={1} size={20} />
                </span>
              </Button>
            </Link>
            <Link to="/names">
              <Button>
                Add names
                <span className="inline-block ml-2">
                  <UsersRound strokeWidth={1} size={20} />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      )}
      {routedata.names && !routedata.questions && (
        <div className="max-w-[40rem] mt-24 space-y-4 rounded-md bg-zinc-900 p-8 ml-[450px]">
          <p>Almost there. You also need questions.</p>
          <Link to="/questions">
            <Button className="mt-4">
              Add questions
              <span className="inline-block ml-2">
                <MessageCircleQuestion strokeWidth={1} size={20} />
              </span>
            </Button>
          </Link>
        </div>
      )}
      {!routedata.names && routedata.questions && (
        <div className="max-w-[40rem] mt-24 space-y-4 rounded-md bg-zinc-900 p-8 ml-[450px]">
          <p>Looks like you got questions but no names.</p>
          <Link to="/names">
            <Button className="mt-4">
              Add names
              <span className="inline-block ml-2">
                <UsersRound strokeWidth={1} size={20} />
              </span>
            </Button>
          </Link>
        </div>
      )}
      {routedata.names && routedata.questions && (
        <>
          <WheelComponent
            persons={routedata.names
              .filter((name) => name.active)
              .map((name) => name.name)}
            question={q_idx ? routedata.questions[q_idx] : null}
            getRandomQ={_getRandomQ}
          />
          <div className="flex gap-2 justify-center mt-12 lg:mt-4 mx-auto">
            {routedata.questions.map((q, idx) => {
              if (idx === q_idx) {
                return (
                  <div
                    key={q}
                    className="h-[1rem] w-[1rem] rounded-[.25rem] border border-zinc-300 dark:border-zinc-400 bg-[#65e3ab]"
                  />
                );
              }
              return (
                <div
                  key={q}
                  className="h-[1rem] w-[1rem] rounded-[.25rem] border border-zinc-300 dark:border-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                />
              );
            })}
          </div>
        </>
      )}
      <Footer />
    </>
  );
}

export async function rootLoader() {
  const names = await JSON.parse(
    localStorage.getItem(CONSTANTS.SETTINGS_NAMES),
  );
  const questions = await JSON.parse(
    localStorage.getItem(CONSTANTS.SETTINGS_QUESTIONS),
  );
  const apikey = await localStorage.getItem(CONSTANTS.SETTINGS_APIKEY);
  return {
    apikey,
    names,
    questions,
  };
}

function EmptyState() {
  return (
    <div className="max-w-[40rem] mt-24 ml-[32.125rem] space-y-4 rounded-md bg-zinc-900 p-8">
      <h1 className="text-[2rem] font-bold">Random questions for your team</h1>
      <p>It goes a little something like this...</p>
      <p>
        You have a team gathering, either in person or online, and you want to
        have a lighthearted session where every team member can be involved
        (potentially, it really is random).
      </p>
      <p>
        Playing <em>Random Questions</em> has been a tradition for us at The
        Talent Company for a long time. Now you can play too.
      </p>
      <p>You need:</p>
      <ul className="list-decimal ml-4">
        <li>
          Team member names
          <br />
          (don't worry, if your'e using AlexisHR we got you)
        </li>
        <li>
          Questions
          <br />
          (no worry here either, we have a few suggestions)
        </li>
      </ul>
      <p>
        Just click the{" "}
        <Link to="/settings">
          <span className="inline-block">
            <Settings
              strokeWidth={1}
              size={20}
              className="cursor-pointer hover:stroke-blue-400"
            />
          </span>
        </Link>
        {", "}
        <Link to="/names">
          <span className="inline-block">
            <UsersRound
              strokeWidth={1}
              size={20}
              className="cursor-pointer hover:stroke-blue-400"
            />
          </span>
        </Link>{" "}
        and{" "}
        <Link to="/questions">
          <span className="inline-block">
            <MessageCircleQuestion
              strokeWidth={1}
              size={20}
              className="cursor-pointer hover:stroke-blue-400"
            />
          </span>
        </Link>{" "}
        icons in the upper right corner and you should be good to go.
      </p>
    </div>
  );
}
