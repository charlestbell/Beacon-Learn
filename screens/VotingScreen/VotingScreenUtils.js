export const changeBeforeVote = (topicName, topics, setTopics) => {
  const isName = element => element.name === topicName;
  const topicIndex = topics.findIndex(isName);
  const previousTopicName = topics[topicIndex - 1]
    ? topics[topicIndex - 1].name
    : null;

  let updatedTopics = [...topics];

  if (previousTopicName) {
    if (!updatedTopics[topicIndex].beforeVotes[previousTopicName]) {
      updatedTopics[topicIndex].beforeVotes = {
        ...updatedTopics[topicIndex].beforeVotes,
        [previousTopicName]: { total: 1, addresses: [] },
      };
    } else {
      const newVoteCount =
        topics[topicIndex].beforeVotes[previousTopicName].total + 1;
      updatedTopics[topicIndex].beforeVotes[previousTopicName].total =
        newVoteCount;
    }
  }
  sortTopics(updatedTopics, setTopics);
};
export const changeAfterVote = (topicName, topics, setTopics) => {
  const isName = element => element.name === topicName;
  const topicIndex = topics.findIndex(isName);
  const nextTopicName = topics[topicIndex + 1]
    ? topics[topicIndex + 1].name
    : null;

  let updatedTopics = [...topics];

  if (nextTopicName) {
    if (!updatedTopics[topicIndex].afterVotes[nextTopicName]) {
      updatedTopics[topicIndex].afterVotes = {
        ...updatedTopics[topicIndex].afterVotes,
        [nextTopicName]: { total: 1, addresses: [] },
      };
    } else {
      const newVoteCount =
        topics[topicIndex].afterVotes[nextTopicName].total + 1;
      updatedTopics[topicIndex].afterVotes[nextTopicName].total = newVoteCount;
    }

    sortTopics(updatedTopics, setTopics);
  }
};

const largest = (a, b) => {
  if (a >= b) {
    return a;
  } else {
    return b;
  }
};

const compare = (a, b) => {
  const bPower = largest(
    a.afterVotes[b.name]?.total ?? 0,
    b.beforeVotes[a.name]?.total ?? 0
  );
  const aPower = largest(
    b.afterVotes[a.name]?.total ?? 0,
    a.beforeVotes[b.name]?.total ?? 0
  );

  if (aPower > bPower) {
    return -1;
  } else {
    return 1;
  }
};

const sortTopics = (updatedTopics, setTopics) => {
  const sortedTopics = updatedTopics.sort(compare);
  setTopics(sortedTopics);
};
