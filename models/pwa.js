/**
 * Copyright 2015-2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const crypto = require('crypto');
const uri = require('urijs');
const Manifest = require('../models/manifest');

class Pwa {
  constructor(manifestUrl, manifestModel) {
    this.manifestUrl = manifestUrl;
    this._manifest = stringifyManifestIfNeeded(manifestModel);
    this.created = new Date();
    this.updated = this.created;
    this.visible = true;
  }

  get name() {
    if (!this.manifest) {
      return '';
    }
    return this.manifest.name || '';
  }

  get description() {
    if (this.manifest && this.manifest.description) {
      return this.manifest.description;
    }

    return this.metaDescription || '';
  }

  get startUrl() {
    if (!this.manifest) {
      return '';
    }
    return this.manifest.startUrl || '';
  }

  get absoluteStartUrl() {
    if (!this.manifestUrl) {
      return '';
    }

    const startUrl = this.startUrl || '/';
    return uri(startUrl).absoluteTo(this.manifestUrl).toString();
  }

  get backgroundColor() {
    if (!this.manifest) {
      return '#ffffff';
    }

    return this.manifest.backgroundColor || '#ffffff';
  }

  get manifest() {
    if (!this._manifest) {
      return null;
    }
    return new Manifest(this.manifestUrl, JSON.parse(this._manifest));
  }

  set manifest(value) {
    if (value && typeof value === 'object') {
      this._manifest = value.raw;
    } else {
      this._manifest = value;
    }
  }

  get manifestAsString() {
    return this._manifest;
  }

  setUserId(user) {
    this.user = {
      id: crypto.createHash('sha1').update(user.getPayload().sub).digest('hex')
    };
  }
}

function stringifyManifestIfNeeded(manifest) {
  if (manifest && typeof manifest === 'object') {
    return manifest.raw;
  }
  return manifest;
}

module.exports = Pwa;
