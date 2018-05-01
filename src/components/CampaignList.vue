<template>
    <div class="campaignList">
        <p>title: {{ title }}</p>
        <p>description: {{ description }}</p>
    </div>
</template>

<script>
  module.exports = {
    name: 'CampaignList',
    props: [
      'title',
      'description',
      'created',
      'createdBy',
      'permissions'
    ]
  }
</script>
