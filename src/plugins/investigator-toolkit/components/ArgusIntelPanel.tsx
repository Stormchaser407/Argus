/**
 * Project Argus — Main Intelligence Panel
 * Combines User Profiling, Group Membership, and Network Mapping
 * into a single panel that integrates into the right-column profile view.
 */

import { memo } from '../../../lib/teact/teact';
import { isUserId } from '../../../util/entities/ids';
import UserProfilingPanel from './UserProfilingPanel';
import GroupMembershipViewer from './GroupMembershipViewer';
import NetworkMappingPanel from './NetworkMappingPanel';

type OwnProps = {
  chatOrUserId: string;
};

const ArgusIntelPanel = ({ chatOrUserId }: OwnProps) => {
  // Only show for user profiles, not channels/groups
  if (!isUserId(chatOrUserId)) {
    return undefined;
  }

  return (
    <div className="ArgusIntelPanel">
      <UserProfilingPanel userId={chatOrUserId} />
      <GroupMembershipViewer userId={chatOrUserId} />
      <NetworkMappingPanel userId={chatOrUserId} />
    </div>
  );
};

export default memo(ArgusIntelPanel);
