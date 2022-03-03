import formatDistanceToNow from "date-fns/formatDistanceToNow";
import parseISO from "date-fns/parseISO";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";

import useKeydown from "../hooks/use-keydown";
import styles from "../styles/Home.module.css";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const Home: NextPage = () => {
  const query = "!is:done";
  const { data: stories } = useSWR<Story[]>(`/api/stories/${query}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const [storyIndex, setStoryIndex] = useState(0);
  const [actions, setActions] = useState<
    { archived?: boolean; estimate?: number; id: number }[]
  >([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (stories) {
      setActions([{ id: stories[0].id }]);
    }
  }, [stories]);

  useKeydown(() => {
    if (stories?.[storyIndex]) {
      const id = stories[storyIndex].id;
      const action = actions.find((a) => a.id === id);
      if (action) {
        setActions(
          actions.map((a) =>
            a.id === id ? { ...a, archived: !a.archived } : a
          )
        );
      } else {
        setActions([...actions, { archived: true, id }]);
      }
    }
  }, "KeyA");

  useKeydown(() => {
    if (stories?.[storyIndex]) {
      const id = stories[storyIndex].id;
      const action = actions.find((a) => a.id === id);
      if (action) {
        setActions(
          actions.map((a) =>
            a.id === id
              ? { ...a, estimate: Math.max((a.estimate || 0) - 1, 0) }
              : a
          )
        );
      } else {
        setActions([
          ...actions,
          {
            estimate: Math.max(stories[storyIndex].estimate - 1, 0),
            id,
          },
        ]);
      }
    }
  }, "KeyS");

  useKeydown(() => {
    if (stories?.[storyIndex]) {
      const id = stories[storyIndex].id;
      const action = actions.find((a) => a.id === id);
      if (action) {
        setActions(
          actions.map((a) =>
            a.id === id ? { ...a, estimate: (a.estimate || 0) + 1 } : a
          )
        );
      } else {
        setActions([
          ...actions,
          { estimate: stories[storyIndex].estimate + 1, id },
        ]);
      }
    }
  }, "KeyD");

  useKeydown(() => {
    if (stories?.[storyIndex + 1]) {
      const id = stories[storyIndex + 1].id;
      setActions([...actions, { id }]);
      setStoryIndex((i) => Math.min(i + 1, stories.length));
    }
  }, "KeyF");

  useKeydown(() => {
    if (stories && actions.length >= stories.length) {
      handleActions();
    }
  }, "Enter");

  const handleActions = () => {
    actions.forEach((action) => {
      if (action.archived != null || action.estimate != null) {
        const { id, ...body } = action;
        fetch(`/api/stories/${id}`, {
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            "Shortcut-Token": process.env.NEXT_PUBLIC_SHORTCUT_API_TOKEN || "",
          },
          method: "PUT",
        })
          .then((r) => r.json())
          .then((r) => {
            setSuccess("Stories updated!");
            console.log("action result", r);
          })
          .catch((e) => console.error("action error", e));
      }
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>BURNDOWN by Michael Knepprath</title>
        <meta name="description" content="A tool for rapid ticket triaging." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a
            href="https://www.youtube.com/watch?v=Xv-3MCGY-r8"
            rel="noopener noreferrer"
            target="_blank"
          >
            BURNDOWN
          </a>
        </h1>

        {stories?.length ? (
          <>
            <p className={styles.description}>
              A tool for rapid ticket triaging.
              <br />
              Press <code className={styles.code}>A</code> to archive,{" "}
              <code className={styles.code}>S</code>/
              <code className={styles.code}>D</code> to toggle the estimate, or
              <code className={styles.code}>F</code> to move to the next ticket.
            </p>

            {actions.length < stories?.length ? (
              <div className={styles.grid}>
                <a
                  href={stories[storyIndex].app_url}
                  className={styles.card}
                  key={stories[storyIndex].id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h2>
                    {actions[storyIndex]?.archived ? (
                      <>
                        <del>{stories[storyIndex].name}</del> 🔥
                      </>
                    ) : (
                      stories[storyIndex].name
                    )}
                  </h2>
                  <p>Description: {stories[storyIndex].description}</p>
                  <p>
                    Deadline:{" "}
                    {stories[storyIndex].deadline
                      ? formatDistanceToNow(
                          parseISO(stories[storyIndex].deadline),
                          {
                            addSuffix: true,
                          }
                        )
                      : "none"}
                  </p>
                  <p>
                    Estimate: {stories[storyIndex].estimate || 0}
                    {actions[storyIndex]?.estimate
                      ? ` → ${actions[storyIndex].estimate}`
                      : ""}
                  </p>
                  <p>Epic ID: {stories[storyIndex].epic_id}</p>
                </a>
                {stories
                  .slice(storyIndex + 1, storyIndex + 4)
                  .map((story, index) => (
                    <a
                      href={story.app_url}
                      className={styles.card}
                      key={story.id}
                      style={{ opacity: 0.7 - index * 0.3 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h2>{story.name} &rarr;</h2>
                      <p>Description: {story.description}</p>
                    </a>
                  ))}
              </div>
            ) : (
              <>
                <button className={styles.button} onClick={handleActions}>
                  🔥 Publish Your Changes 🔥
                </button>
                {success && <p>{success}</p>}
              </>
            )}
          </>
        ) : null}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://mknepprath.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by Michael Knepprath
        </a>
      </footer>
    </div>
  );
};

export default Home;
