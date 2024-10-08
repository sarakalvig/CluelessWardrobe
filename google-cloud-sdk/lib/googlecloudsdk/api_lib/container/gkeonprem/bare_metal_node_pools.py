# -*- coding: utf-8 -*- #
# Copyright 2022 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Utilities for node pool resources in Anthos clusters on bare metal."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from apitools.base.py import list_pager
from googlecloudsdk.api_lib.container.gkeonprem import bare_metal_clusters as clusters
from googlecloudsdk.api_lib.container.gkeonprem import update_mask
from googlecloudsdk.calliope import exceptions


class _BareMetalNodePoolsClient(clusters.ClustersClient):
  """Base class for GKE OnPrem Bare Metal API clients."""

  def _node_taints(self, args):
    """Constructs proto message NodeTaint."""
    taint_messages = []
    node_taints = getattr(args, 'node_taints', {})
    if not node_taints:
      return []

    for node_taint in node_taints.items():
      taint_object = self._parse_node_taint(node_taint)
      taint_messages.append(
          self._messages.NodeTaint(**taint_object))

    return taint_messages

  def _node_labels(self, args):
    """Constructs proto message LabelsValue."""
    node_labels = getattr(args, 'node_labels', {})
    additional_property_messages = []
    if not node_labels:
      return None

    for key, value in node_labels.items():
      additional_property_messages.append(
          self._messages.BareMetalNodePoolConfig.LabelsValue.AdditionalProperty(
              key=key, value=value))

    labels_value_message = self._messages.BareMetalNodePoolConfig.LabelsValue(
        additionalProperties=additional_property_messages)

    return labels_value_message

  def _node_configs_from_file(self, args):
    """Constructs proto message field node_configs."""
    if not args.node_configs_from_file:
      return []

    node_configs = args.node_configs_from_file.get('nodeConfigs', [])

    if not node_configs:
      raise exceptions.BadArgumentException(
          '--node_configs_from_file',
          'Missing field [nodeConfigs] in Node configs file.')

    node_config_messages = []
    for node_config in node_configs:
      node_config_messages.append(self._bare_metal_node_config(node_config))

    return node_config_messages

  # TODO(b/260737834): Create a common function for all nodeConfigs
  def _bare_metal_node_config(self, node_config):
    """Constructs proto message BareMetalNodeConfig."""
    node_ip = node_config.get('nodeIP', '')
    if not node_ip:
      raise exceptions.BadArgumentException(
          '--node_configs_from_file',
          'Missing field [nodeIP] in Node configs file.')

    kwargs = {
        'nodeIp': node_ip,
        'labels': self._node_config_labels(node_config.get('labels', {}))
    }

    return self._messages.BareMetalNodeConfig(**kwargs)

  def _node_config_labels(self, labels):
    """Constructs proto message LabelsValue."""
    additional_property_messages = []
    if not labels:
      return None

    for key, value in labels.items():
      additional_property_messages.append(
          self._messages.BareMetalNodeConfig.LabelsValue.AdditionalProperty(
              key=key, value=value))

    labels_value_message = self._messages.BareMetalNodeConfig.LabelsValue(
        additionalProperties=additional_property_messages)

    return labels_value_message

  def _node_configs_from_flag(self, args):
    """Constructs proto message field node_configs."""
    node_configs = []
    node_config_flag_value = getattr(
        args, 'node_configs', None
    )
    if node_config_flag_value:
      for node_config in node_config_flag_value:
        node_configs.append(self.node_config(node_config))

    return node_configs

  def _cpu_cfs_quota_disabled(self, args):
    if 'disable_cpu_cfs_quota' in args.GetSpecifiedArgsDict():
      return True
    elif 'enable_cpu_cfs_quota' in args.GetSpecifiedArgsDict():
      return False
    else:
      return None

  def _feature_gates(self, args):
    feature_gates = self.GetFlag(args, 'feature_gates')
    if not feature_gates:
      return None

    msg = self._messages.BareMetalKubeletConfig.FeatureGatesValue(
        additionalProperties=[]
    )
    for key, value in feature_gates.items():
      msg.additionalProperties.append(
          self._messages.BareMetalKubeletConfig.FeatureGatesValue.AdditionalProperty(
              key=key, value=value
          )
      )
    return msg

  def _serialized_image_pulls_disabled(self, args):
    if 'disable_serialize_image_pulls' in args.GetSpecifiedArgsDict():
      return True
    elif 'enable_serialize_image_pulls' in args.GetSpecifiedArgsDict():
      return False
    else:
      return None

  def _cpu_manager_policy(self, args):
    cpu_manager_policy = self.GetFlag(args, 'cpu_manager_policy')
    if cpu_manager_policy:
      return self._messages.BareMetalKubeletConfig.CpuManagerPolicyValueValuesEnum.lookup_by_name(
          cpu_manager_policy
      )
    return None

  def _cpu_cfs_quota_period(self, args):
    # TODO(b/273546993)
    # Only supports second as unit, ms and other units are not supported.
    return self.GetFlag(args, 'cpu_cfs_quota_period')

  def _kubelet_config(self, args):
    kwargs = {
        'cpuManagerPolicy': self._cpu_manager_policy(args),
        'cpuCfsQuotaDisabled': self._cpu_cfs_quota_disabled(args),
        'cpuCfsQuotaPeriod': self._cpu_cfs_quota_period(args),
        'featureGates': self._feature_gates(args),
        'podPidsLimit': self.GetFlag(args, 'pod_pids_limit'),
        'registryPullQps': self.GetFlag(args, 'registry_pull_qps'),
        'registryBurst': self.GetFlag(args, 'registry_burst'),
        'serializeImagePullsDisabled': self._serialized_image_pulls_disabled(
            args
        ),
    }
    if any(kwargs.values()):
      return self._messages.BareMetalKubeletConfig(**kwargs)
    return None

  def _node_pool_config(self, args):
    """Constructs proto message BareMetalNodePoolConfig."""
    if 'node_configs_from_file' in args.GetSpecifiedArgsDict():
      node_configs = self._node_configs_from_file(args)
    else:
      node_configs = self._node_configs_from_flag(args)
    kwargs = {
        'nodeConfigs': node_configs,
        'labels': self._node_labels(args),
        'taints': self._node_taints(args),
        'kubeletConfig': self._kubelet_config(args),
    }

    if any(kwargs.values()):
      return self._messages.BareMetalNodePoolConfig(**kwargs)

    return None

  def _annotations(self, args):
    """Constructs proto message AnnotationsValue."""
    annotations = getattr(args, 'annotations', {})
    additional_property_messages = []
    if not annotations:
      return None

    for key, value in annotations.items():
      additional_property_messages.append(
          self._messages.BareMetalNodePool.AnnotationsValue.AdditionalProperty(
              key=key, value=value))

    annotation_value_message = self._messages.BareMetalNodePool.AnnotationsValue(
        additionalProperties=additional_property_messages)
    return annotation_value_message

  def _bare_metal_node_pool(self, args):
    """Constructs proto message BareMetalNodePool."""
    kwargs = {
        'name': self._node_pool_name(args),
        'nodePoolConfig': self._node_pool_config(args),
        'displayName': getattr(args, 'display_name', None),
        'annotations': self._annotations(args),
    }

    return self._messages.BareMetalNodePool(**kwargs)


class NodePoolsClient(_BareMetalNodePoolsClient):
  """Client for node pools in Anthos clusters on bare metal API."""

  def __init__(self, **kwargs):
    super(NodePoolsClient, self).__init__(**kwargs)
    self._service = self._client.projects_locations_bareMetalClusters_bareMetalNodePools

  def List(self, location_ref, limit=None, page_size=None):
    """Lists Node Pools in the Anthos clusters on bare metal API."""
    list_req = self._messages.GkeonpremProjectsLocationsBareMetalClustersBareMetalNodePoolsListRequest(
        parent=location_ref.RelativeName())

    return list_pager.YieldFromList(
        self._service,
        list_req,
        field='bareMetalNodePools',
        batch_size=page_size,
        limit=limit,
        batch_size_attribute='pageSize',
    )

  def Describe(self, resource_ref):
    """Gets a GKE On-Prem Bare Metal API node pool resource."""
    req = self._messages.GkeonpremProjectsLocationsBareMetalClustersBareMetalNodePoolsGetRequest(
        name=resource_ref.RelativeName())

    return self._service.Get(req)

  def Delete(self, args):
    """Deletes a GKE On-Prem Bare Metal API node pool resource."""
    kwargs = {
        'name': self._node_pool_name(args),
        'allowMissing': self.GetFlag(args, 'allow_missing'),
        'validateOnly': self.GetFlag(args, 'validate_only'),
        'ignoreErrors': self.GetFlag(args, 'ignore_errors'),
    }
    req = self._messages.GkeonpremProjectsLocationsBareMetalClustersBareMetalNodePoolsDeleteRequest(
        **kwargs)

    return self._service.Delete(req)

  def Create(self, args):
    """Creates a GKE On-Prem Bare Metal API node pool resource."""
    node_pool_ref = self._node_pool_ref(args)
    kwargs = {
        'parent': node_pool_ref.Parent().RelativeName(),
        'validateOnly': self.GetFlag(args, 'validate_only'),
        'bareMetalNodePool': self._bare_metal_node_pool(args),
        'bareMetalNodePoolId': self._node_pool_id(args),
    }
    req = self._messages.GkeonpremProjectsLocationsBareMetalClustersBareMetalNodePoolsCreateRequest(
        **kwargs)
    return self._service.Create(req)

  def Update(self, args):
    """Updates a GKE On-Prem Bare Metal API node pool resource."""
    kwargs = {
        'allowMissing': self.GetFlag(args, 'allow_missing'),
        'name': self._node_pool_name(args),
        'updateMask':
            update_mask.get_update_mask(
                args, update_mask.BARE_METAL_NODE_POOL_ARGS_TO_UPDATE_MASKS),
        'validateOnly': self.GetFlag(args, 'validate_only'),
        'bareMetalNodePool': self._bare_metal_node_pool(args),
    }
    req = self._messages.GkeonpremProjectsLocationsBareMetalClustersBareMetalNodePoolsPatchRequest(
        **kwargs)
    return self._service.Patch(req)
