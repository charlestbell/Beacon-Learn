export const changeBeforeVote = (topicName, topics, setTopics) => {
  const isName = element => element.name === topicName;
  const topicIndex = topics.findIndex(isName);
  const previousTopicName = topics[topicIndex - 1]
    ? topics[topicIndex - 1].name
    : null;

  let updatedTopics = [...topics];

  if (previousTopicName) {
    if (!updatedTopics[topicIndex].beforeVotes[previousTopicName]) {
      updatedTopics[topicIndex] = {
        ...updatedTopics[topicIndex],
        beforeVotes: { [previousTopicName]: { total: 1, addresses: [] } },
      };
    } else {
      const newVoteCount =
        topics[topicIndex].beforeVotes[previousTopicName].total + 1;
      updatedTopics[topicIndex].beforeVotes[previousTopicName].total =
        newVoteCount;
    }
    sortTopics(updatedTopics, setTopics);
  }
};

const sortTopics = (updatedTopics, setTopics) => {
  const compare = (a, b) => {
    const aBeforeVotes = !a.beforeVotes[b.name]
      ? 0
      : !a.beforeVotes[b.name].total
      ? 0
      : a.beforeVotes[b.name].total;

    const bBeforeVotes = !b.beforeVotes[a.name]
      ? 0
      : !b.beforeVotes[a.name].total
      ? 0
      : b.beforeVotes[a.name].total;
    console.log(
      a.name + ' is before ' + b.name + ' by ' + aBeforeVotes + ' votes'
    );
    console.log(
      b.name + ' is before ' + a.name + ' by ' + bBeforeVotes + ' votes'
    );

    if (
      typeof a.beforeVotes[b.name] !== 'undefined' &&
      typeof b.beforeVotes[a.name] === 'undefined'
    ) {
      return -1;
    } else if (
      typeof a.beforeVotes[b.name] === 'undefined' &&
      typeof b.beforeVotes[a.name] !== 'undefined'
    ) {
      return 1;
    } else if (
      typeof a.beforeVotes[b.name] === 'undefined' &&
      typeof b.beforeVotes[a.name] === 'undefined'
    ) {
      return 1;
    } else if (a.beforeVotes[b.name].total > b.beforeVotes[a.name].total) {
      return -1;
    } else {
      return 1;
    }
  };

  const sortedTopics = updatedTopics.sort(compare);
  setTopics(sortedTopics);
};
