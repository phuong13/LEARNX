import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Topic from "./components/tag/Topic";
import { useTopic } from "../../store/useTopic";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Container = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const { forumId } = useParams();
  const { t } = useTranslation();
  const { createTopic, getTopics } = useTopic();

  const fetchTopics = async () => {
    if (!forumId) return;
    setLoading(true);
    try {
      const res = await getTopics(forumId);
      setTopics(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [forumId]);

  const handleCreateTopic = async () => {
    if (!newTopic.trim() || !forumId) return;

    try {
      await createTopic({ content: newTopic, forumId });
      await fetchTopics();
      setShowPopup(false);
      setNewTopic("");
    } catch (err) {
      console.error("Lỗi khi tạo topic:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full focus:outline-none" tabIndex={-1}>
      {forumId ? (
        <button
          className="py-2 px-4 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setShowPopup(true)}
        >
          {t("forum.create_topic")}
        </button>
      ) : (
        <div className="text-lg text-center text-slate-600 font-semibold pt-6 h-full bg-white rounded-lg shadow-md">
          {t("forum.please_select_forum")}
        </div>
      )}

      {loading ? (
        <Box sx={{ display: 'flex' , justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : topics.length > 0 && forumId ? (
        <div className="flex flex-col gap-4 h-full bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          {topics.map((topic) => (
            <Topic
              key={topic.id}
              topicId={topic.id}
              user={topic.account}
              content={topic.content}
              createAt={topic.createdAt}
            />
          ))}
        </div>
      ) : (
        forumId && (
          <div className="text-center mt-6 text-slate-600 font-semibold">
            {t("forum.no_topics")}
          </div>
        )
      )}

      {/* Popup Create Topic */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30"
        >
          <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-xl h-[405px]">
            <h2 className="text-lg text-slate-600 font-semibold mb-2">{t("forum.new_topic_title")}</h2>
            <textarea
              className="w-full h-[300px] border border-slate-300 focus:border-slate-400 outline-none p-2 rounded-md text-slate-600"
              placeholder={t("forum.new_topic_placeholder")}
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                className="py-2 px-6 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setShowPopup(false)}
              >
                {t("forum.cancel")}
              </button>
              <button
                className="py-2 px-6 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
                onClick={handleCreateTopic}
              >
                {t("forum.submit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Container;
