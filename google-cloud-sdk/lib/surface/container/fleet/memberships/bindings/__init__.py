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
"""Command group for Membership-Bindings."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from googlecloudsdk.calliope import base


@base.ReleaseTracks(base.ReleaseTrack.ALPHA, base.ReleaseTrack.BETA)
class Membership(base.Group):
  """Membership Bindings for permissions.

  This command group allows for manipulation of bindings associated with
  membership-scope.

  ## EXAMPLES

  Manage Bindings:

    $ {command} --help
  """

  category = base.COMPUTE_CATEGORY


@base.Hidden
@base.ReleaseTracks(base.ReleaseTrack.GA)
class MembershipGA(Membership):
  pass
