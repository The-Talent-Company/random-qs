import alexislogo from "@/alexishr-logo-white.svg";
import ttclogo from "@/ttc-logo-white.svg";

export default function Footer() {
  return (
    <div className="flex flex-col gap-4 lg:gap-12 lg:flex-row items-start justify-center px-8 py-24 mt-32 bg-zinc-900 text-zinc-300">
      <div className="max-w-[36rem] lg:w-[36rem] space-y-4">
        <p>
          Investing in HR Tech is an integral part of our history at The Talent
          Company. AlexisHR was the first investment of ours that made it all
          the way.
        </p>
        <p>
          This small application was open sourced as a farewell gift when
          AlexisHR was bought by Simployer.
        </p>
      </div>
      <div className="flex gap-4 items-center mt-8 lg:mt-0">
        <a href="https://talentcompany.io">
          <img src={ttclogo} width={120} alt="The Talent Company logotype" />
        </a>
        <img
          alt="Heart"
          width="20"
          height="18"
          src="data:image/svg+xml;utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='219.909' height='200.019' viewBox='0 0 206.165 187.518'%3E%3Cpath d='M54.774 0c-3.145-.007-6.476.34-10.018 1.1a60.383 60.383 0 0 0-28.062 16.648 60.382 60.382 0 0 0 .994 84.375l85.394 85.395 85.395-85.395A60.382 60.382 0 0 0 161.409 1.1C157.866.34 154.536-.007 151.39 0 129.378.05 116.43 17.38 103.082 30.73 89.735 17.38 76.787.049 54.774 0z' fill='%23ff634d' /%3E%3C/svg%3E"
          style={{ margin: "0px 0.25rem -0.25rem" }}
        />
        <a href="https://alexishr.com">
          <img src={alexislogo} width={120} alt="AlexisHR logotype" />
        </a>
      </div>
    </div>
  );
}
