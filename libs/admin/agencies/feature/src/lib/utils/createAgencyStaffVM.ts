import { Dictionary } from '@ngrx/entity';

import {
  AgencyStaffVM,
  AgencyVM,
  AgencyRoleVM,
  EmailVM,
  PrimaryAgentVM,
} from '@hbx/admin/shared/view-models';
import {
  AgencyStaff,
  AgencyRole,
  PrimaryAgent,
  AgencyRoleState,
} from '@hbx/api-interfaces';

export function createSingleAgencyStaffVM(
  staff: AgencyStaff,
  agencyVMs: Dictionary<AgencyVM>
): AgencyStaffVM {
  const {
    _id,
    first_name,
    last_name,
    dob,
    agency_roles,
    agent_emails,
    hbx_id,
  } = staff;

  // Filter out roles where the agency staff role is held by the primary agent
  // or where the agency doesn't exit?
  const filteredRoles: AgencyRole[] = agency_roles.filter(role => {
    let agencyVM: AgencyVM;
    let primaryAgent: PrimaryAgentVM;

    agencyVM = agencyVMs[role.agency_profile_id];

    if (agencyVM !== undefined) {
      primaryAgent = agencyVM.primaryAgent;
      return hbx_id !== primaryAgent.hbxId;
    } else {
      return false;
    }
  });

  const agencyRoles: AgencyRoleVM[] = filteredRoles.map(role => {
    const {
      orgId,
      profileType,
      primaryAgent,
      agencyProfileId,
      agencyName,
    } = agencyVMs[role.agency_profile_id];

    const agencyRole: AgencyRoleVM = {
      agencyName,
      currentState: convertAasmState(role.aasm_state),
      roleId: role.role_id,
      orgId,
      primaryAgent,
      agencyProfileId,
      profileType,
    };

    return agencyRole;
  });

  const emails: EmailVM[] = agent_emails.map(email => {
    return { id: email.id, address: email.address, kind: email.kind };
  });

  const agencyStaffVM: AgencyStaffVM = {
    agencyRoles,
    emails,
    firstName: first_name,
    lastName: last_name,
    dob: new Date(dob),
    hbxId: hbx_id,
    personId: _id,
  };

  return agencyStaffVM;
}

export function filterAgencyStaffWithNoRoles(
  agencyStaff: AgencyStaffVM
): boolean {
  return agencyStaff.agencyRoles.length > 0;
}

export function createAllAgencyStaffVMs(
  agencyStaff: AgencyStaff[],
  agencies: Dictionary<AgencyVM>
): AgencyStaffVM[] {
  return agencyStaff
    .map(staff => createSingleAgencyStaffVM(staff, agencies))
    .filter(filterAgencyStaffWithNoRoles);
}

export function createPrimaryAgentDictionary(
  primaryAgents: PrimaryAgent[]
): Dictionary<PrimaryAgent> {
  const primaryAgentDictionary: Dictionary<PrimaryAgent> = primaryAgents.reduce(
    (dictionary, agent) => {
      return {
        ...dictionary,
        [agent.connected_profile_id]: agent,
      };
    },
    {}
  );

  return primaryAgentDictionary;
}

export function convertAasmState(aasm_state: AgencyRoleState): AgencyRoleState {
  if (
    aasm_state === AgencyRoleState.GATerminated ||
    aasm_state === AgencyRoleState.BATerminated
  ) {
    return AgencyRoleState.Terminated;
  }

  if (
    aasm_state === AgencyRoleState.GAPending ||
    aasm_state === AgencyRoleState.BAPending
  ) {
    return AgencyRoleState.Pending;
  }

  return aasm_state;
}
