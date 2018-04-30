<template>
    <div class="campaignList">
        <p>name: {{ name }}</p>
        <p>description: {{ description }}</p>
    </div>
</template>

<script>
  module.exports = {
    name: 'CampaignList',
    props: ['name', 'description']
  }
</script>
