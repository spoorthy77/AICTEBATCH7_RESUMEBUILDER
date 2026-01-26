/**
 * Distribute items equally among agents
 * If items cannot be divided equally, remaining items are distributed sequentially
 * 
 * @param {Array} items - Array of items to distribute
 * @param {Array} agents - Array of agent objects with _id and name
 * @returns {Array} Array of distributions for each agent
 */
exports.distributeItems = (items, agents) => {
  if (!agents || agents.length === 0) {
    throw new Error("No agents available for distribution");
  }

  if (!items || items.length === 0) {
    throw new Error("No items to distribute");
  }

  const distributions = [];
  const itemsPerAgent = Math.floor(items.length / agents.length);
  let remainingItems = items.length % agents.length;

  let itemIndex = 0;

  agents.forEach((agent, agentIndex) => {
    const agentItems = [];
    
    // Calculate number of items for this agent
    const itemsForThisAgent = itemsPerAgent + (remainingItems > 0 ? 1 : 0);
    
    // Add items to this agent
    for (let i = 0; i < itemsForThisAgent && itemIndex < items.length; i++) {
      const item = items[itemIndex];
      agentItems.push({
        firstName: item.FirstName || '',
        phone: item.Phone || '',
        notes: item.Notes || ''
      });
      itemIndex++;
    }

    if (remainingItems > 0) {
      remainingItems--;
    }

    distributions.push({
      agentId: agent._id,
      agentName: agent.name,
      items: agentItems,
      itemCount: agentItems.length
    });
  });

  return distributions;
};

/**
 * Validate agents count (should be 5)
 * @param {Array} agents - Array of agents
 * @returns {boolean} True if valid
 */
exports.validateAgentCount = (agents) => {
  return agents && agents.length === 5;
};

// Legacy export for backwards compatibility
module.exports.default = (items, agents) => {
  const result = agents.map(a => ({ agent: a, tasks: [] }));

  let index = 0;

  items.forEach(item => {
    result[index].tasks.push(item);
    index = (index + 1) % agents.length;
  });

  return result;
};
